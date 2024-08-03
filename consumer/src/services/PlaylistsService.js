const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
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
      songs: result.rows
        ? result.rows.map((row) => ({
            id: row.songId,
            title: row.title,
            performer: row.performer,
          }))
        : [],
    };
  }
}

module.exports = PlaylistsService;
