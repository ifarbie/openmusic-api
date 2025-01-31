class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(req, h) {
    this._validator.validateSongPayload(req.payload);

    const songId = await this._service.addSong(req.payload);

    const response = h.response({
      status: 'success',
      data: { songId },
    });
    response.code(201);
    return response;
  }

  async getAllSongsHandler(req) {
    this._validator.validateSongQuery(req.query);
    const songs = await this._service.getAllSongs(req.query);
    return {
      status: 'success',
      data: { songs },
    };
  }

  async getSongByIdHandler(req, h) {
    const { id } = req.params;
    const { song, source } = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: { song },
    });
    response.header('X-Data-Source', source);
    return response;
  }

  async putSongByIdHandler(req) {
    this._validator.validateSongPayload(req.payload);
    const { id } = req.params;
    await this._service.editSongById(id, req.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(req) {
    const { id } = req.params;

    await this._service.verifySongExist(id);
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
