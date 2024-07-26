const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema } = require('./schema');

const playlistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistsValidator;
