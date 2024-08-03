class AlbumUserLikesHandler {
  constructor(albumsService, albumUserLikesService) {
    this._albumsService = albumsService;
    this._albumUserLikesService = albumUserLikesService;
  }

  async postAlbumUserLikeHandler(req, h) {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._albumsService.verifyAlbumExist(albumId);
    await this._albumUserLikesService.verifyAlbumUserLikeExist(albumId, userId);
    await this._albumUserLikesService.addAlbumUserLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan like',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumUserLikeHandler(req) {
    const { id: albumId } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._albumsService.verifyAlbumExist(albumId);
    await this._albumUserLikesService.deleteAlbumUserLike(albumId, userId);

    return {
      status: 'success',
      message: 'Berhasil menghapus like pada album',
    };
  }

  async getAlbumLikesCountHandler(req, h) {
    const { id: albumId } = req.params;

    const { likes, source } = await this._albumUserLikesService.getAlbumLikesCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', source);
    return response;
  }
}

module.exports = AlbumUserLikesHandler;
