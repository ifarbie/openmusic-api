const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications where token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications where token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
