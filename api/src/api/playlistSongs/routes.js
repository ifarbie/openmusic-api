const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (req, h) => handler.postPlaylistSongHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (req) => handler.getPlaylistSongsByIdHandler(req),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (req) => handler.deletePlaylistSongByIdHandler(req),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
