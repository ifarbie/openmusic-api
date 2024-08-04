const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity({
    playlistId, songId, userId, action,
  }) {
    const id = nanoid(16);
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistActivitiesById(playlistId) {
    const query = {
      text: `
        SELECT pa."playlistId", u.username, s.title, pa.action, pa.time
        FROM playlist_activities pa
        JOIN users u ON pa."userId" = u.id
        JOIN songs s ON pa."songId" = s.id
        WHERE pa."playlistId" = $1
        ORDER BY pa.time ASC
        `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      playlistId: result.rows[0].playlistId,
      activities: result.rows
        ? result.rows.map((row) => ({
          username: row.username,
          title: row.title,
          action: row.action,
          time: row.time,
        }))
        : [],
    };
  }
}

module.exports = PlaylistActivitiesService;
