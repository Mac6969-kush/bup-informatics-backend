const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { createSummary, listSummariesByStudy } = require('../models/summaryModel');
const { ok, fail } = require('../utils/http');

router.get('/:studyId', requireAuth, async (req, res, next) => {
  try {
    const summaries = await listSummariesByStudy(req.params.studyId);
    return ok(res, { summaries });
  } catch (err) {
    return next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const studyId = String(req.body.studyId || '').trim();
    const datasetId = req.body.datasetId || null;
    const title = String(req.body.title || '').trim();
    const mode = String(req.body.mode || 'standard').trim();
    const bodyHtml = String(req.body.bodyHtml || '').trim();

    if (!studyId || !title || !bodyHtml) {
      return fail(res, 'studyId, title, and bodyHtml are required');
    }

    const summary = await createSummary({
      studyId,
      datasetId,
      title,
      mode,
      bodyHtml,
      createdBy: req.auth.user.id
    });

    return ok(res, { summary }, 201);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
