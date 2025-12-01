const { ReplyPayloadSchema } = require('./schema');
const InvariantError = require('../../../../Commons/exceptions/InvariantError');

class RepliesValidator {
  validatePayload(payload) {
    const { error } = ReplyPayloadSchema.validate(payload);
    if (error) {
      const errorMessage = error.details[0].message;
      if (errorMessage.includes('required')) {
        throw new InvariantError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
      }
      if (errorMessage.includes('must be')) {
        throw new InvariantError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
      throw new InvariantError('ADD_REPLY.INVALID_PAYLOAD');
    }
  }
}

module.exports = RepliesValidator;