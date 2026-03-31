const router = require('express').Router();
const { ok } = require('../utils/http');

router.get('/', (req, res) => ok(res, { service: 'bup-informatics-backend-v1', status: 'healthy' }));

module.exports = router;
