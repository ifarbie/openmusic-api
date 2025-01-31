const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (req, h) => handler.postAlbumHandler(req, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (req, h) => handler.getAlbumByIdHandler(req, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (req) => handler.putAlbumByIdHandler(req),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (req) => handler.deleteAlbumByIdHandler(req),
  },
];

module.exports = routes;
