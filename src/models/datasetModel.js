const { query } = require('../config/db');

async function createDataset(record) {
  const result = await query(
    `insert into datasets (
      study_id, source_file_id, name, columns_json, inferred_types_json,
      row_count, column_count, profile_json, created_by
    ) values ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9)
    returning *`,
    [
      record.studyId,
      record.sourceFileId || null,
      record.name,
      JSON.stringify(record.columns || []),
      JSON.stringify(record.inferredTypes || {}),
      record.rowCount || 0,
      record.columnCount || 0,
      JSON.stringify(record.profile || {}),
      record.createdBy
    ]
  );
  return result.rows[0];
}

async function listDatasetsByStudy(studyId) {
  const result = await query(
    `select *
       from datasets
      where study_id = $1
      order by created_at desc`,
    [studyId]
  );
  return result.rows;
}

module.exports = { createDataset, listDatasetsByStudy };
