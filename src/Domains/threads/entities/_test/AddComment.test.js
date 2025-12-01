const AddComment = require('../AddComment');

describe('AddComment entity inside threads domain', () => {
  it('should throw error when payload is invalid', () => {
    expect(() => new AddComment()).toThrowError('ADD_COMMENT.INVALID_PAYLOAD');
  });

  it('should throw error when content missing', () => {
    expect(() => new AddComment({})).toThrowError('ADD_COMMENT.NOT_CONTAIN_CONTENT');
  });

  it('should throw error when content is not string', () => {
    expect(() => new AddComment({ content: 123 })).toThrowError('ADD_COMMENT.CONTENT_NOT_A_STRING');
  });

  it('should create entity correctly', () => {
    const addComment = new AddComment({ content: 'komentar di thread' });
    expect(addComment.content).toEqual('komentar di thread');
  });
});

