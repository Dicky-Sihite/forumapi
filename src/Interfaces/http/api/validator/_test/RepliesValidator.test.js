const RepliesValidator = require('../RepliesValidator');
const InvariantError = require('../../../../../Commons/exceptions/InvariantError');

describe('RepliesValidator', () => {
  let validator;

  beforeAll(() => {
    validator = new RepliesValidator();
  });

  it('should not throw error when payload is valid', () => {
    // Arrange
    const validPayload = {
      content: 'sebuah balasan',
    };

    // Action & Assert
    expect(() => validator.validatePayload(validPayload)).not.toThrow();
  });

  it('should throw InvariantError when payload does not contain needed property', () => {
    // Arrange
    const invalidPayload = {};

    // Action & Assert
    expect(() => validator.validatePayload(invalidPayload))
      .toThrow(InvariantError);
    expect(() => validator.validatePayload(invalidPayload))
      .toThrow('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw InvariantError when content is not a string', () => {
    // Arrange
    const invalidPayload = {
      content: 123,
    };

    // Action & Assert
    expect(() => validator.validatePayload(invalidPayload))
      .toThrow(InvariantError);
    expect(() => validator.validatePayload(invalidPayload))
      .toThrow('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw InvariantError when content is an empty string', () => {
    // Arrange
    const invalidPayload = {
      content: '',
    };

    // Action & Assert
    expect(() => validator.validatePayload(invalidPayload))
      .toThrow(InvariantError);
  });

  it('should throw InvariantError when payload contains unknown property', () => {
    // Arrange
    const invalidPayload = {
      content: 'sebuah balasan',
      unknownProperty: 'unknown',
    };

    // Action & Assert
    expect(() => validator.validatePayload(invalidPayload))
      .toThrow(InvariantError);
  });
});
