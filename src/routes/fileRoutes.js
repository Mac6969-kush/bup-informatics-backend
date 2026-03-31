const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const multer = require('multer');
const { v4: uuid } = require('uuid');
const env = require('../config/env');
const { requireAuth } = require('../middleware/auth');
const { ok, fail } = require('../utils/http');
const { createFile, listFilesByStudy } = require('../models/fileModel');
const { createDataset } = require('../models/datasetModel');
const { parseCsv, inferTypes, summarizeDataset } = require('../services/datasetService');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.uploadAbs),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${uuid()}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 }
});

router.get('/:studyId', requireAuth, async (req, res, next) => {
  try {
    const files = await listFilesByStudy(req.params.studyId);
    return ok(res, { files });
  } catch (err) {
    return next(err);
  }
});

router.post('/upload', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    const studyId = String(req.body.studyId || '').trim();
    const folderPath = String(req.body.folderPath || 'BUP/').trim();
    if (!studyId) return fail(res, 'studyId is required');
    if (!req.file) return fail(res, 'file is required');

    let dataset = null;
    if (/\.csv$/i.test(req.file.originalname)) {
      const text = fs.readFileSync(req.file.path, 'utf8');
      const parsed = parseCsv(text);
      const inferredTypes = inferTypes(parsed);
      const profile = summarizeDataset(parsed, inferredTypes);
      dataset = await createDataset({
        studyId,
        name: req.file.originalname.replace(/\.csv$/i, ''),
        columns: parsed.columns,
        inferredTypes,
        rowCount: profile.rowCount,
        columnCount: profile.columnCount,
        profile,
        createdBy: req.auth.user.id
      });
    }

    const fileRecord = await createFile({
      studyId,
      uploadedBy: req.auth.user.id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      byteSize: req.file.size,
      storagePath: req.file.path,
      folderPath,
      datasetId: dataset?.id || null
    });

    return ok(res, { file: fileRecord, dataset }, 201);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
