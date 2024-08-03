const AlbumUserLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'album_user_likes',
  version: '1.0.0',
  register: async (server, { albumsService, albumUserLikesService }) => {
    const albumUserLikesHandler = new AlbumUserLikesHandler(albumsService, albumUserLikesService);
    server.route(routes(albumUserLikesHandler));
  },
};
