const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { listStudies, createStudy } = require('../models/studyModel');
const { ok, fail } = require('../utils/http');

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const studies = await listStudies();
    return ok(res, { studies });
  } catch (err) {
    return next(err);
  }
});

router.post('/', requireAuth, requireRole('owner', 'admin'), async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return fail(res, 'Study name is required');
    const study = await createStudy({ name, createdBy: req.auth.user.id });
    return ok(res, { study }, 201);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
