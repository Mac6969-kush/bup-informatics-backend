const jwt = require('jsonwebtoken');
const env = require('../config/env');

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    env.jwtSecret,
    { expiresIn: '8h' }
  );
}

module.exports = { issueToken };
