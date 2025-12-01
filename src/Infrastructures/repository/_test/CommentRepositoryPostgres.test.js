const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

const USER_ONE_ID = 'user-comment-123';
const USER_TWO_ID = 'user-comment-456';
const USER_ONE_USERNAME = 'comment_user_one';
const USER_TWO_USERNAME = 'comment_user_two';
const THREAD_ID = 'thread-comment-123';

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const addUserAndThread = async () => {
    await UsersTableTestHelper.addUser({ id: USER_ONE_ID, username: USER_ONE_USERNAME });
    await UsersTableTestHelper.addUser({ id: USER_TWO_ID, username: USER_TWO_USERNAME });
    await ThreadsTableTestHelper.addThread({
      id: THREAD_ID,
      owner: USER_ONE_ID,
      title: 'judul',
      body: 'isi',
    });
  };

  describe('addComment function', () => {
    it('should persist comment and return added comment', async () => {
      await addUserAndThread();
      const fakeIdGenerator = () => 'comment-123';
      const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await repository.addComment(THREAD_ID, USER_ONE_ID, 'sebuah komentar');

      const comments = await CommentsTableTestHelper.findCommentById('comment-comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toEqual({
        id: 'comment-comment-123',
        content: 'sebuah komentar',
        owner: USER_ONE_ID,
      });
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments ordered by date', async () => {
      await addUserAndThread();
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-123',
        threadId: THREAD_ID,
        owner: USER_ONE_ID,
        content: 'komentar pertama',
        date: '2021-08-08',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-124',
        threadId: THREAD_ID,
        owner: USER_TWO_ID,
        content: 'komentar kedua',
        date: '2021-08-09',
        isDelete: true,
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      const comments = await repository.getCommentsByThreadId(THREAD_ID);

      expect(comments).toHaveLength(2);
      expect(comments[0]).toMatchObject({
        id: 'comment-comment-123',
        username: USER_ONE_USERNAME,
        content: 'komentar pertama',
        is_delete: false,
      });
      expect(comments[1]).toMatchObject({
        id: 'comment-comment-124',
        username: USER_TWO_USERNAME,
        content: 'komentar kedua',
        is_delete: true,
      });
    });
  });

  describe('getCommentById function', () => {
    it('should return comment detail correctly', async () => {
      await addUserAndThread();
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-123',
        threadId: THREAD_ID,
        owner: USER_ONE_ID,
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      const comment = await repository.getCommentById('comment-comment-123');

      expect(comment).toMatchObject({
        id: 'comment-comment-123',
        content: 'sebuah komentar',
        owner: USER_ONE_ID,
        thread_id: THREAD_ID,
        is_delete: false,
      });
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw error when comment does not exist', async () => {
      await addUserAndThread();
      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.verifyCommentOwner('comment-404', USER_ONE_ID))
        .rejects.toThrowError('COMMENT_NOT_FOUND');
    });

    it('should throw error when owner is invalid', async () => {
      await addUserAndThread();
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-123',
        owner: USER_ONE_ID,
        threadId: THREAD_ID,
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.verifyCommentOwner('comment-comment-123', USER_TWO_ID))
        .rejects.toThrowError('COMMENT_NOT_OWNER');
    });

    it('should resolve true when owner valid', async () => {
      await addUserAndThread();
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-123',
        owner: USER_ONE_ID,
        threadId: THREAD_ID,
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.verifyCommentOwner('comment-comment-123', USER_ONE_ID))
        .resolves.toBe(true);
    });
  });

  describe('softDeleteComment function', () => {
    it('should change is_delete to true', async () => {
      await addUserAndThread();
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-123',
        isDelete: false,
        threadId: THREAD_ID,
        owner: USER_ONE_ID,
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      await repository.softDeleteComment('comment-comment-123');

      const comment = await CommentsTableTestHelper.findCommentById('comment-comment-123');
      expect(comment[0].is_delete).toBe(true);
    });
  });

  describe('verifyCommentAvailable function', () => {
    it('should throw error when comment not found', async () => {
      await addUserAndThread();
      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.verifyCommentAvailable({ commentId: 'comment-404', threadId: THREAD_ID }))
        .rejects.toThrowError('COMMENT_NOT_FOUND');
    });

    it('should throw error when comment is not in the same thread', async () => {
      await addUserAndThread();
      await ThreadsTableTestHelper.addThread({
        id: 'thread-comment-456',
        owner: USER_ONE_ID,
        title: 'judul lain',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-123',
        threadId: 'thread-comment-456',
        owner: USER_ONE_ID,
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.verifyCommentAvailable({
        commentId: 'comment-comment-123',
        threadId: THREAD_ID,
      }))
        .rejects.toThrowError('COMMENT_NOT_FOUND');
    });

    it('should resolve true when comment exists in thread', async () => {
      await addUserAndThread();
      await CommentsTableTestHelper.addComment({
        id: 'comment-comment-123',
        threadId: THREAD_ID,
        owner: USER_ONE_ID,
      });
      const repository = new CommentRepositoryPostgres(pool, {});

      await expect(repository.verifyCommentAvailable({
        commentId: 'comment-comment-123',
        threadId: THREAD_ID,
      }))
        .resolves.toBe(true);
    });
  });
});

