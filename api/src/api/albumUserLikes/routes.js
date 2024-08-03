const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (req, h) => handler.postAlbumUserLikeHandler(req, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (req) => handler.deleteAlbumUserLikeHandler(req),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (req, h) => handler.getAlbumLikesCountHandler(req, h),
  },
];

module.exports = routes;
