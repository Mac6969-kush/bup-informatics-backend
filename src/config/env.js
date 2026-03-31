const path = require('path');
const fs = require('fs');
require('dotenv').config();

const env = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 25),
  authMode: process.env.AUTH_MODE || 'local'
};

const uploadAbs = path.resolve(process.cwd(), env.uploadDir);
if (!fs.existsSync(uploadAbs)) fs.mkdirSync(uploadAbs, { recursive: true });

env.uploadAbs = uploadAbs;

module.exports = env;
