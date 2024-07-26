class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService) {
    this._playlistActivitiesService = playlistActivitiesService;
    this._playlistsService = playlistsService;
  }

  async getPlaylistActivitiesByIdHandler(req) {
    const { id: playlistId } = req.params;
    const { id: owner } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistExist(playlistId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    const data = await this._playlistActivitiesService.getPlaylistActivitiesById(playlistId);

    return {
      status: 'success',
      data,
    };
  }
}

module.exports = PlaylistActivitiesHandler;
