const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studyRoutes = require('./routes/studyRoutes');
const fileRoutes = require('./routes/fileRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: env.corsOrigin.length ? env.corsOrigin : true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ ok: true, service: 'bup-informatics-backend-v1' }));
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/studies', studyRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/summaries', summaryRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
