const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (req, h) => handler.postUploadAlbumCoverHandler(req, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{params*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../albums/files'),
      },
    },
  },
];

module.exports = routes;
