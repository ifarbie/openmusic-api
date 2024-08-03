const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumUserLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumUserLike(albumId, userId) {
    const id = `album_user_like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_user_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    await this._pool.query(query);

    await this._cacheService.delete(`album:${albumId}:likes`);
  }

  async deleteAlbumUserLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_user_likes WHERE "albumId" = $1 AND "userId" = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    await this._cacheService.delete(`album:${albumId}:likes`);
  }

  async getAlbumLikesCount(albumId) {
    try {
      const source = 'cache';
      const likes = await this._cacheService.get(`album:${albumId}:likes`);
      return { likes, source };
    } catch {
      const source = 'server';
      const query = {
        text: 'SELECT id FROM album_user_likes WHERE "albumId" = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`album:${albumId}:likes`, JSON.stringify(result.rows.length));

      return { likes: result.rows.length, source };
    }
  }

  async verifyAlbumUserLikeExist(albumId, userId) {
    const query = {
      text: 'SELECT id FROM album_user_likes WHERE "albumId" = $1 AND "userId" = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Tidak boleh menyukai album yang sama');
    }
  }
}

module.exports = AlbumUserLikesService;
