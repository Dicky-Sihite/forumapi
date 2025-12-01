const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when addReply invoked', async () => {
    const repository = new ReplyRepository();
    await expect(repository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyReplyOwner invoked', async () => {
    const repository = new ReplyRepository();
    await expect(repository.verifyReplyOwner({ replyId: 'reply-123', owner: 'user-123' })).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when deleteReply invoked', async () => {
    const repository = new ReplyRepository();
    await expect(repository.deleteReply('reply-123')).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getRepliesByCommentId invoked', async () => {
    const repository = new ReplyRepository();
    await expect(repository.getRepliesByCommentId('comment-123')).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyReplyAvailable invoked', async () => {
    const repository = new ReplyRepository();
    await expect(repository.verifyReplyAvailable({ replyId: 'reply-123', commentId: 'comment-123' })).rejects
      .toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
