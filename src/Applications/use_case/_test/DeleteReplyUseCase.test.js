const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
    };

    const mockReplyRepository = {
      verifyReplyAvailable: jest.fn(() => Promise.resolve()),
      verifyReplyOwner: jest.fn(() => Promise.resolve()),
      deleteReply: jest.fn(() => Promise.resolve()),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockthreadsRepository.verifyThreadExist).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailable).toHaveBeenCalledWith({
      commentId: 'comment-123',
      threadId: 'thread-123',
    });
    expect(mockReplyRepository.verifyReplyAvailable).toHaveBeenCalledWith({
      replyId: 'reply-123',
      commentId: 'comment-123',
    });
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith({
      replyId: 'reply-123',
      owner: 'user-123',
    });
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith('reply-123');
  });

  it('should throw error when thread does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.reject(new Error('THREAD_NOT_FOUND'))),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(),
    };

    const mockReplyRepository = {
      verifyReplyAvailable: jest.fn(),
      verifyReplyOwner: jest.fn(),
      deleteReply: jest.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrow('THREAD_NOT_FOUND');
  });

  it('should throw error when comment does not exist in thread', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.reject(new Error('COMMENT_NOT_FOUND'))),
    };

    const mockReplyRepository = {
      verifyReplyAvailable: jest.fn(),
      verifyReplyOwner: jest.fn(),
      deleteReply: jest.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrow('COMMENT_NOT_FOUND');
  });

  it('should throw error when reply does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
    };

    const mockReplyRepository = {
      verifyReplyAvailable: jest.fn(() => Promise.reject(new Error('REPLY_NOT_FOUND'))),
      verifyReplyOwner: jest.fn(),
      deleteReply: jest.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrow('REPLY_NOT_FOUND');
  });

  it('should throw error when user is not the reply owner', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
    };

    const mockReplyRepository = {
      verifyReplyAvailable: jest.fn(() => Promise.resolve()),
      verifyReplyOwner: jest.fn(() => Promise.reject(new Error('REPLY_NOT_OWNER'))),
      deleteReply: jest.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrow('REPLY_NOT_OWNER');
  });

  it('should call deleteReply after all verifications pass', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
    };

    const mockReplyRepository = {
      verifyReplyAvailable: jest.fn(() => Promise.resolve()),
      verifyReplyOwner: jest.fn(() => Promise.resolve()),
      deleteReply: jest.fn(() => Promise.resolve()),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledTimes(1);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith('reply-123');
  });
});
