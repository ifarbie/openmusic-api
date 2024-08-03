class ExportPlaylistsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportPlaylistsHandler(req, h) {
    this._validator.validateExportPlaylistPayload(req.payload);
    const { playlistId } = req.params;
    const { id: owner } = req.auth.credentials;

    const message = {
      targetEmail: req.payload.targetEmail,
      playlistId,
    };

    await this._playlistsService.verifyPlaylistExist(playlistId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportPlaylistsHandler;
