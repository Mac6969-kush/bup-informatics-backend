const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/db');

async function start() {
  try {
    await pool.query('select 1');
    app.listen(env.port, () => {
      console.log(`BUP Informatics backend listening on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start backend:', err.message);
    process.exit(1);
  }
}

start();
