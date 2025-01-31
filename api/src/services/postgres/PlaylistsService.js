const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlayListsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    await this._cacheService.delete(`playlist:${owner}`);
    return result.rows[0].id;
  }

  async getAllPlaylists(owner) {
    try {
      const playlists = await this._cacheService.get(`playlist:${owner}`);
      return { playlists, source: 'cache' };
    } catch (error) {
      const query = {
        text: `SELECT p.id, p.name, u.username FROM playlists p
        LEFT JOIN collaborations c ON c."playlistId" = p.id
        LEFT JOIN users u ON p.owner = u.id
        WHERE p.owner = $1 OR c."userId" = $1`,
        values: [owner],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`playlist:${owner}`, JSON.stringify(result.rows));
      return { playlists: result.rows, source: 'server' };
    }
  }

  async deletePlaylistById(playlistId, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus, Id tidak ditemukan');
    }

    await this._cacheService.delete(`playlist:${owner}`);
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT id FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Kamu tidak berhak mengakses playlist ini');
    }
  }

  async verifyPlaylistExist(playlistId) {
    const query = {
      text: 'SELECT id FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlayListsService;
