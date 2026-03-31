const router = require('express').Router();
const bcrypt = require('bcrypt');
const { findByEmail } = require('../models/userModel');
const { issueToken } = require('../services/tokenService');
const { ok, fail } = require('../utils/http');
const { requireAuth } = require('../middleware/auth');

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();
    if (!email || !password) return fail(res, 'Email and password are required');

    const user = await findByEmail(email);
    if (!user) return fail(res, 'Invalid credentials', 401);
    if (!user.is_active) return fail(res, 'User is inactive', 403);

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) return fail(res, 'Invalid credentials', 401);

    const token = issueToken(user);
    return ok(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        employeeType: user.employee_type,
        scope: user.scope,
        roles: user.roles
      }
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return ok(res, { user: req.auth.user });
});

router.get('/microsoft-config', (req, res) => {
  return ok(res, {
    phase: 'placeholder',
    message: 'Backend v1 is ready to accept Microsoft Entra token verification in Phase 4.'
  });
});

module.exports = router;
