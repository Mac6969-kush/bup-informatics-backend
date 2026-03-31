const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { listUsers } = require('../models/userModel');
const { ok } = require('../utils/http');

router.get('/', requireAuth, requireRole('owner', 'admin'), async (req, res, next) => {
  try {
    const users = await listUsers();
    return ok(res, { users });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
