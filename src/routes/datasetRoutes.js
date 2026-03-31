const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { listDatasetsByStudy } = require('../models/datasetModel');
const { ok } = require('../utils/http');

router.get('/:studyId', requireAuth, async (req, res, next) => {
  try {
    const datasets = await listDatasetsByStudy(req.params.studyId);
    return ok(res, { datasets });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
