function parseCsv(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n').filter(line => line.trim().length > 0);
  if (!lines.length) return { columns: [], rows: [] };

  const columns = splitCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const parts = splitCsvLine(lines[i]);
    const row = {};
    for (let c = 0; c < columns.length; c += 1) {
      row[columns[c]] = parts[c] ?? '';
    }
    rows.push(row);
  }

  return { columns, rows };
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}

function inferTypes(parsed) {
  const types = {};
  for (const col of parsed.columns) {
    let numeric = 0;
    let total = 0;
    for (const row of parsed.rows.slice(0, 100)) {
      const value = row[col];
      if (value === '' || value == null) continue;
      total += 1;
      const n = Number(String(value).trim());
      if (Number.isFinite(n)) numeric += 1;
    }
    types[col] = total > 0 && numeric / total >= 0.8 ? 'number' : 'text';
  }
  return types;
}

function summarizeDataset(parsed, types) {
  const rowCount = parsed.rows.length;
  const columnCount = parsed.columns.length;
  let missing = 0;
  parsed.rows.forEach(row => {
    parsed.columns.forEach(col => {
      const value = row[col];
      if (value === '' || value == null) missing += 1;
    });
  });

  return {
    rowCount,
    columnCount,
    missingCells: missing,
    numericColumns: parsed.columns.filter(col => types[col] === 'number'),
    textColumns: parsed.columns.filter(col => types[col] === 'text')
  };
}

module.exports = { parseCsv, inferTypes, summarizeDataset };
