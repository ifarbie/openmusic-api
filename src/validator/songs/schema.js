const Joi = require('joi');
const { currentYear } = require('../../constants');

const SongPayloadSchema = Joi.object({
  title: Joi
    .string()
    .required(),
  year: Joi
    .number()
    .integer()
    .min(0)
    .max(currentYear)
    .required(),
  genre: Joi
    .string()
    .required(),
  performer: Joi
    .string()
    .required(),
  duration: Joi
    .number(),
  albumId: Joi
    .string(),
});

const SongQuerySchema = Joi.object({
  title: Joi.string().empty(''),
  performer: Joi.string().empty(''),
});

module.exports = { SongPayloadSchema, SongQuerySchema };
