const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};