require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const ClientError = require('./exceptions/ClientError');

// albums
const albums = require('./api/albums');
const albumsValidator = require('./validator/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

// songs
const songs = require('./api/songs');
const songsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

// users
const users = require('./api/users');
const usersValidator = require('./validator/users');
const UsersService = require('./services/postgres/UsersService');

// authentications
const authentications = require('./api/authentications');
const authenticationsValidator = require('./validator/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const tokenManager = require('./tokenize/tokenManager');

// playlists
const playlists = require('./api/playlists');
const playlistsValidator = require('./validator/playlists');
const PlayListsService = require('./services/postgres/PlaylistsService');

// playlist_songs
const playlistSongs = require('./api/playlistSongs');
const playlistSongsValidator = require('./validator/playlistSongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');

// playlist_activities
const playlistActivities = require('./api/playlistActivities');
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService');

// collaborations
const collaborations = require('./api/collaborations');
const collaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');

// exports
const exportPlaylists = require('./api/exportPlaylists');
const exportPlaylistsValidator = require('./validator/exportPlaylists');
const producerService = require('./services/rabbitmq/ProducerService');

// upload album covers
const uploadAlbumCovers = require('./api/uploadAlbumCovers');
const StorageService = require('./services/storage/StorageService');
const uploadsValidator = require('./validator/uploads');

// album user likes
const albumUserLikes = require('./api/albumUserLikes');
const AlbumUserLikesService = require('./services/postgres/AlbumUserLikesService');

// cache
const CacheService = require('./services/redis/CacheService');
const config = require('./utils/config');

const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService(cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlayListsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const playlistActivitiesService = new PlaylistActivitiesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/files/images'));
  const albumUserLikesService = new AlbumUserLikesService(cacheService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: config.jwt.accessSecret,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.tokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: albumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: songsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        validator: authenticationsValidator,
        tokenManager,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: playlistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        playlistSongsService,
        songsService,
        playlistsService,
        playlistActivitiesService,
        validator: playlistSongsValidator,
      },
    },
    {
      plugin: playlistActivities,
      options: {
        playlistActivitiesService,
        playlistsService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: exportPlaylists,
      options: {
        producerService,
        playlistsService,
        validator: exportPlaylistsValidator,
      },
    },
    {
      plugin: uploadAlbumCovers,
      options: {
        storageService,
        albumsService,
        validator: uploadsValidator,
      },
    },
    {
      plugin: albumUserLikes,
      options: {
        albumsService,
        albumUserLikesService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
