const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
      content: 'sebuah comment',
    };

    const mockthreadsRepository = {
      verifyThreadExist: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      addComment: jest.fn(() => Promise.resolve({
        id: 'comment-xyz',
        content: 'sebuah comment',
        owner: 'user-123',
      })),
    };

    const addCommentUseCase = new AddCommentUseCase({
      threadsRepository: mockthreadsRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toEqual(expect.objectContaining({
      id: expect.any(String),
      content: 'sebuah comment',
      owner: 'user-123',
    }));
    expect(mockthreadsRepository.verifyThreadExist).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith('thread-123', 'user-123', 'sebuah comment');
  });
});
