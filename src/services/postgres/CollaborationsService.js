const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi berhasil ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2 RETURNING id',
      values: [playlistId, userId],
    };

    await this._pool.query(query);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
