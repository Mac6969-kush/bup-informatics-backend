const { fail } = require('../utils/http');

function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  return fail(res, err.message || 'Internal server error', err.status || 500);
}

module.exports = { errorHandler };
