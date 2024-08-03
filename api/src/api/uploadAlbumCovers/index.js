const UploadAlbumCoversHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'upload_album_covers',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, validator }) => {
    const uploadAlbumCoversHandler = new UploadAlbumCoversHandler(
      storageService,
      albumsService,
      validator,
    );
    server.route(routes(uploadAlbumCoversHandler));
  },
};
