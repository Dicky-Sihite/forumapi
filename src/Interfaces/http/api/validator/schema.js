const Joi = require('joi');

const ReplyPayloadSchema = Joi.object({
  content: Joi.string().required(),
});

module.exports = { ReplyPayloadSchema };
