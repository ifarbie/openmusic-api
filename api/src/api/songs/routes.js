const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (req, h) => handler.postSongHandler(req, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (req) => handler.getAllSongsHandler(req),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (req, h) => handler.getSongByIdHandler(req, h),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (req) => handler.putSongByIdHandler(req),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (req) => handler.deleteSongByIdHandler(req),
  },
];

module.exports = routes;
