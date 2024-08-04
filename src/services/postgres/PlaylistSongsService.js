const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(playlistId, songId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getPlaylistSongsById(playlistId) {
    const query = {
      text: `
      SELECT 
        p.id as "playlistId", p.name, 
        u.username, 
        s.title, s.year, s.performer, s.id as "songId"
      FROM playlist_songs ps 
      JOIN playlists p ON ps."playlistId" = p.id
      JOIN users u ON p.owner = u.id
      JOIN songs s ON ps."songId" = s.id
      WHERE ps."playlistId" = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      id: result.rows[0].playlistId,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: result.rows ? result.rows.map((row) => ({
        id: row.songId,
        title: row.title,
        performer: row.performer,
      })) : [],
    };
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE "playlistId" = $1 AND "songId" = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
