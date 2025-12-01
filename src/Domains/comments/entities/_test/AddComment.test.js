const AddComment = require('../AddComment');

describe('AddComment entity', () => {
  it('should throw error when payload not provided', () => {
    expect(() => new AddComment()).toThrowError('ADD_COMMENT.INVALID_PAYLOAD');
  });

  it('should throw error when content is missing', () => {
    expect(() => new AddComment({})).toThrowError('ADD_COMMENT.NOT_CONTAIN_CONTENT');
  });

  it('should throw error when content is not a string', () => {
    expect(() => new AddComment({ content: 123 })).toThrowError('ADD_COMMENT.CONTENT_NOT_A_STRING');
  });

  it('should create AddComment entity correctly', () => {
    const addComment = new AddComment({ content: 'sebuah komentar' });

    expect(addComment.content).toEqual('sebuah komentar');
  });
});

