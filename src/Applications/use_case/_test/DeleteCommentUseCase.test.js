const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
      verifyCommentOwner: jest.fn(() => Promise.resolve()),
      softDeleteComment: jest.fn(() => Promise.resolve()),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockthreadsRepository.verifyThreadExist).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailable).toHaveBeenCalledWith({
      commentId: 'comment-123',
      threadId: 'thread-123',
    });
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.softDeleteComment).toHaveBeenCalledWith('comment-123');
  });

  it('should throw error when thread does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.reject(new Error('THREAD_NOT_FOUND'))),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(),
      softDeleteComment: jest.fn(),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrow('THREAD_NOT_FOUND');
  });

  it('should throw error when comment does not exist', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.reject(new Error('COMMENT_NOT_FOUND'))),
      softDeleteComment: jest.fn(),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrow('COMMENT_NOT_FOUND');
  });

  it('should throw error when user is not the comment owner', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
      verifyCommentOwner: jest.fn(() => Promise.reject(new Error('COMMENT_NOT_OWNER'))),
      softDeleteComment: jest.fn(),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrow('COMMENT_NOT_OWNER');
  });

  it('should call softDeleteComment after all verifications pass', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentAvailable: jest.fn(() => Promise.resolve()),
      verifyCommentOwner: jest.fn(() => Promise.resolve()),
      softDeleteComment: jest.fn(() => Promise.resolve()),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.softDeleteComment).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.softDeleteComment).toHaveBeenCalledWith('comment-123');
  });
});
