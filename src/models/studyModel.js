const { query } = require('../config/db');
const { slugify } = require('../utils/slug');

async function listStudies() {
  const result = await query(
    `select id, name, slug, status, created_at, created_by
       from studies
      where status <> 'deleted'
      order by created_at desc`
  );
  return result.rows;
}

async function createStudy({ name, createdBy }) {
  const result = await query(
    `insert into studies (name, slug, status, created_by)
     values ($1, $2, 'active', $3)
     returning id, name, slug, status, created_at, created_by`,
    [name, slugify(name), createdBy]
  );
  return result.rows[0];
}

module.exports = { listStudies, createStudy };
