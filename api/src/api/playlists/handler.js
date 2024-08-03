class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(req, h) {
    this._validator.validatePlaylistPayload(req.payload);
    const { name } = req.payload;
    const { id: owner } = req.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(req, h) {
    const { id: owner } = req.auth.credentials;

    const { playlists, source } = await this._service.getAllPlaylists(owner);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.header('X-Data-Source', source);
    return response;
  }

  async deletePlaylistByIdHandler(req) {
    const { id: playlistId } = req.params;
    const { id: owner } = req.auth.credentials;

    await this._service.verifyPlaylistExist(playlistId);
    await this._service.verifyPlaylistOwner(playlistId, owner);
    await this._service.deletePlaylistById(playlistId, owner);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
