const config = require('../../utils/config');

class UploadAlbumCoversHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postUploadAlbumCoverHandler(req, h) {
    const { cover } = req.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const { id } = req.params;

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/albums/images/${filename}`;

    await this._albumsService.editCoverUrlByAlbumId(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadAlbumCoversHandler;
