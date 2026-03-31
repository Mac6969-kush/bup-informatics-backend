const { query } = require('../config/db');

async function createFile(record) {
  const result = await query(
    `insert into files (
      study_id, uploaded_by, original_name, stored_name, mime_type, byte_size,
      storage_path, folder_path, dataset_id
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    returning *`,
    [
      record.studyId,
      record.uploadedBy,
      record.originalName,
      record.storedName,
      record.mimeType,
      record.byteSize,
      record.storagePath,
      record.folderPath,
      record.datasetId || null
    ]
  );
  return result.rows[0];
}

async function listFilesByStudy(studyId) {
  const result = await query(
    `select f.*, u.full_name as uploaded_by_name
       from files f
       left join app_users u on u.id = f.uploaded_by
      where f.study_id = $1 and f.is_deleted = false
      order by f.created_at desc`,
    [studyId]
  );
  return result.rows;
}

module.exports = { createFile, listFilesByStudy };
