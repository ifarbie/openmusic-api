const ExportPlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'export_playlists',
  version: '1.0.0',
  register: async (server, { producerService, playlistsService, validator }) => {
    const exportPlaylistsHandler = new ExportPlaylistsHandler(
      producerService,
      playlistsService,
      validator,
    );
    server.route(routes(exportPlaylistsHandler));
  },
};
