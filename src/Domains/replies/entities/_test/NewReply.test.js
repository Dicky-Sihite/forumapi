const NewReply = require('../NewReply');

describe('NewReply entity', () => {
  it('should throw error when payload not provided', () => {
    expect(() => new NewReply()).toThrowError('NEW_REPLY.INVALID_PAYLOAD');
  });

  it('should throw error when content is missing', () => {
    expect(() => new NewReply({ threadId: 'thread-123', commentId: 'comment-123', owner: 'user-123' }))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_CONTENT');
  });

  it('should throw error when content is not a string', () => {
    expect(() => new NewReply({
      content: 123,
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    })).toThrowError('NEW_REPLY.CONTENT_NOT_STRING');
  });

  it('should create NewReply entity correctly', () => {
    const newReply = new NewReply({
      content: 'sebuah balasan',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    });

    expect(newReply.content).toEqual('sebuah balasan');
    expect(newReply.threadId).toEqual('thread-123');
    expect(newReply.commentId).toEqual('comment-123');
    expect(newReply.owner).toEqual('user-123');
  });
});
