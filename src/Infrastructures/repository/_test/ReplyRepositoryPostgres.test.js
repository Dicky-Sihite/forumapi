const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  const fakeIdGenerator = () => '123';
  let replyRepository;
  let mockPool;

  beforeEach(() => {
    mockPool = {
      query: jest.fn(),
    };
    replyRepository = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);
  });

  describe('addReply function', () => {
    it('should add reply to database and return added reply', async () => {
      // Arrange
      const expectedAddedReply = {
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      };
      mockPool.query.mockResolvedValueOnce({
        rows: [expectedAddedReply],
      });

      const payload = {
        content: 'sebuah balasan',
        owner: 'user-123',
        commentId: 'comment-123',
      };

      // Action
      const addedReply = await replyRepository.addReply(payload);

      // Assert
      expect(addedReply).toEqual(expectedAddedReply);
      expect(mockPool.query).toHaveBeenCalledWith({
        text: `
        INSERT INTO replies (id, content, owner, comment_id, date, is_delete)
        VALUES ($1, $2, $3, $4, $5, false)
        RETURNING id, content, owner
      `,
        values: ['reply-123', 'sebuah balasan', 'user-123', 'comment-123', expect.any(String)],
      });
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies with correct format including username', async () => {
      // Arrange
      const mockReplies = [
        {
          id: 'reply-1',
          content: 'balasan pertama',
          date: '2023-01-01T00:00:00.000Z',
          is_delete: false,
          username: 'dicoding',
        },
      ];
      mockPool.query.mockResolvedValueOnce({
        rows: mockReplies,
      });

      // Action
      const replies = await replyRepository.getRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toHaveProperty('id', 'reply-1');
      expect(replies[0]).toHaveProperty('username', 'dicoding');
      expect(replies[0]).toHaveProperty('content', 'balasan pertama');
      expect(replies[0]).toHaveProperty('is_delete', false);
    });

    it('should return empty array when no replies exist', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rows: [],
      });

      // Action
      const replies = await replyRepository.getRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toEqual([]);
    });
  });

  describe('verifyReplyAvailable function', () => {
    it('should not throw error when reply exists in comment', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
      });

      // Action & Assert
      await expect(
        replyRepository.verifyReplyAvailable({
          replyId: 'reply-123',
          commentId: 'comment-123',
        })
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundError when reply does not exist', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rowCount: 0,
      });

      // Action & Assert
      await expect(
        replyRepository.verifyReplyAvailable({
          replyId: 'reply-999',
          commentId: 'comment-123',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should not throw error when reply owner matches', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ owner: 'user-123' }],
      });

      // Action & Assert
      await expect(
        replyRepository.verifyReplyOwner({
          replyId: 'reply-123',
          owner: 'user-123',
        })
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundError when reply does not exist', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rowCount: 0,
      });

      // Action & Assert
      await expect(
        replyRepository.verifyReplyOwner({
          replyId: 'reply-999',
          owner: 'user-123',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw AuthorizationError when reply owner does not match', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ owner: 'user-456' }],
      });

      // Action & Assert
      await expect(
        replyRepository.verifyReplyOwner({
          replyId: 'reply-123',
          owner: 'user-123',
        })
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should soft delete reply by calling UPDATE query', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({});

      // Action
      await replyRepository.deleteReply('reply-123');

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith({
        text: 'UPDATE replies SET is_delete = true WHERE id = $1',
        values: ['reply-123'],
      });
    });
  });
});
