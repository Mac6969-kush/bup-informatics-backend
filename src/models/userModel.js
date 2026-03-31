const { query } = require('../config/db');

async function findByEmail(email) {
  const result = await query(
    `select u.id, u.email, u.full_name, u.password_hash, u.employee_type, u.scope, u.is_active,
            array_remove(array_agg(r.name), null) as roles
       from app_users u
       left join user_roles ur on ur.user_id = u.id
       left join roles r on r.id = ur.role_id
      where lower(u.email) = lower($1)
      group by u.id`,
    [email]
  );
  return result.rows[0] || null;
}

async function getById(id) {
  const result = await query(
    `select u.id, u.email, u.full_name, u.employee_type, u.scope, u.is_active,
            array_remove(array_agg(r.name), null) as roles
       from app_users u
       left join user_roles ur on ur.user_id = u.id
       left join roles r on r.id = ur.role_id
      where u.id = $1
      group by u.id`,
    [id]
  );
  return result.rows[0] || null;
}

async function listUsers() {
  const result = await query(
    `select u.id, u.email, u.full_name, u.employee_type, u.scope, u.is_active,
            array_remove(array_agg(r.name), null) as roles,
            u.created_at
       from app_users u
       left join user_roles ur on ur.user_id = u.id
       left join roles r on r.id = ur.role_id
      group by u.id
      order by u.created_at desc`
  );
  return result.rows;
}

module.exports = { findByEmail, getById, listUsers };
