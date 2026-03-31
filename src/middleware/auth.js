const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { query } = require('../config/db');
const { fail } = require('../utils/http');

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return fail(res, 'Missing bearer token', 401);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const userResult = await query(
      `select u.id, u.email, u.full_name, u.employee_type, u.scope, u.is_active,
              array_remove(array_agg(r.name), null) as roles
         from app_users u
         left join user_roles ur on ur.user_id = u.id
         left join roles r on r.id = ur.role_id
        where u.id = $1
        group by u.id`,
      [payload.sub]
    );

    const user = userResult.rows[0];
    if (!user || !user.is_active) return fail(res, 'User not active', 401);
    req.auth = { user };
    return next();
  } catch (err) {
    return fail(res, 'Invalid or expired token', 401);
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.auth?.user?.roles || [];
    if (!allowedRoles.some(role => roles.includes(role))) {
      return fail(res, 'Insufficient permissions', 403, { allowedRoles, currentRoles: roles });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
