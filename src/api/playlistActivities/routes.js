const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (req) => handler.getPlaylistActivitiesByIdHandler(req),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
