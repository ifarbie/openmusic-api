class PlaylistSongsHandler {
  constructor(
    playlistSongsService,
    songsService,
    playlistsService,
    playlistActivitiesService,
    validator,
  ) {
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._playlistsService = playlistsService;
    this._playlistActivitiesService = playlistActivitiesService;
    this._validator = validator;
  }

  async postPlaylistSongHandler(req, h) {
    this._validator.validatePlaylistSongPayload(req.payload);
    const { id: playlistId } = req.params;
    const { id: userId } = req.auth.credentials;
    const { songId } = req.payload;
    const action = 'add';

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._songsService.verifySongExist(songId);
    await this._playlistSongsService.addPlaylistSong(playlistId, songId);
    await this._playlistActivitiesService.addPlaylistActivity({
      playlistId,
      songId,
      userId,
      action,
    });

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsByIdHandler(req) {
    const { id: playlistId } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistExist(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const playlistSongs = await this._playlistSongsService.getPlaylistSongsById(playlistId);

    return {
      status: 'success',
      data: {
        playlist: playlistSongs,
      },
    };
  }

  async deletePlaylistSongByIdHandler(req) {
    this._validator.validatePlaylistSongPayload(req.payload);
    const { songId } = req.payload;
    const { id: playlistId } = req.params;
    const { id: userId } = req.auth.credentials;
    const action = 'delete';

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._playlistSongsService.deletePlaylistSongById(playlistId, songId);
    await this._playlistActivitiesService.addPlaylistActivity({
      playlistId,
      songId,
      userId,
      action,
    });

    return {
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
