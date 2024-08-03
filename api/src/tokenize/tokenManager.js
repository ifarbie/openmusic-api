const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
const config = require('../utils/config');

const tokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.jwt.accessSecret),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.jwt.refreshSecret),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);

      Jwt.token.verify(artifacts, config.jwt.refreshSecret);

      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid!');
    }
  },
};

module.exports = tokenManager;
