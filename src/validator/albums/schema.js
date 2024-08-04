const Joi = require('joi');
const { currentYear } = require('../../constants');

const AlbumPayloadSchema = Joi.object({
  name: Joi
    .string()
    .required(),
  year: Joi
    .number()
    .integer()
    .min(0)
    .max(currentYear)
    .required(),
});

module.exports = { AlbumPayloadSchema };
