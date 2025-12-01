const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when addComment invoked', async () => {
    const repository = new CommentRepository();
    await expect(repository.addComment('thread-123', 'user-123', 'content')).rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyCommentOwner invoked', async () => {
    const repository = new CommentRepository();
    await expect(repository.verifyCommentOwner('comment-123', 'user-123')).rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getCommentById invoked', async () => {
    const repository = new CommentRepository();
    await expect(repository.getCommentById('comment-123')).rejects
      .toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

