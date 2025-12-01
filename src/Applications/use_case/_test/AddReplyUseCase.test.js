const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
      owner: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
    };

    const mockReplyRepository = {
      addReply: jest.fn(() => Promise.resolve({ id: 'reply-123', content: useCasePayload.content, owner: useCasePayload.owner })),
    };

    const addReplyUseCase = new AddReplyUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockthreadsRepository.verifyThreadExist).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailable).toHaveBeenCalledWith({ commentId: 'comment-123', threadId: 'thread-123' });
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith({ content: 'sebuah balasan', owner: 'user-123', commentId: 'comment-123' });
    expect(addedReply).toEqual(expect.objectContaining({ id: expect.any(String), content: 'sebuah balasan', owner: 'user-123' }));
  });

  it('should rethrow error when thread does not exist', async () => {
    const useCasePayload = { content: 'x', owner: 'user-1', threadId: 'thread-1', commentId: 'comment-1' };
    const mockthreadsRepository = { verifyThreadExist: jest.fn(() => Promise.reject(new Error('THREAD_NOT_FOUND'))) };
    const mockCommentRepository = { verifyCommentAvailable: jest.fn() };
    const mockReplyRepository = { addReply: jest.fn() };

    const addReplyUseCase = new AddReplyUseCase({ threadsRepository: mockthreadsRepository, commentRepository: mockCommentRepository, replyRepository: mockReplyRepository });

    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow('THREAD_NOT_FOUND');
  });

  it('should rethrow error when comment not available', async () => {
    const useCasePayload = { content: 'x', owner: 'user-1', threadId: 'thread-1', commentId: 'comment-1' };
    const mockthreadsRepository = { verifyThreadExist: jest.fn(() => Promise.resolve()) };
    const mockCommentRepository = { verifyCommentAvailable: jest.fn(() => Promise.reject(new Error('COMMENT_NOT_FOUND'))) };
    const mockReplyRepository = { addReply: jest.fn() };

    const addReplyUseCase = new AddReplyUseCase({ threadsRepository: mockthreadsRepository, commentRepository: mockCommentRepository, replyRepository: mockReplyRepository });

    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow('COMMENT_NOT_FOUND');
  });
});
