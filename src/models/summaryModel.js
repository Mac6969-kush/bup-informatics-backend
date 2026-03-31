const { query } = require('../config/db');

async function createSummary(record) {
  const result = await query(
    `insert into summaries (
      study_id, dataset_id, title, mode, body_html, created_by
    ) values ($1,$2,$3,$4,$5,$6)
    returning *`,
    [record.studyId, record.datasetId || null, record.title, record.mode, record.bodyHtml, record.createdBy]
  );
  return result.rows[0];
}

async function listSummariesByStudy(studyId) {
  const result = await query(
    `select s.*, u.full_name as created_by_name
       from summaries s
       left join app_users u on u.id = s.created_by
      where s.study_id = $1
      order by s.created_at desc`,
    [studyId]
  );
  return result.rows;
}

module.exports = { createSummary, listSummariesByStudy };
