const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

const THREAD_OWNER_ID = 'user-thread-repo';
const THREAD_OWNER_USERNAME = 'thread_owner_username';

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread and return AddedThread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: THREAD_OWNER_ID, username: THREAD_OWNER_USERNAME });
      const repository = new ThreadsRepositoryPostgres(pool);
      jest.spyOn(Date, 'now').mockReturnValue(123456);

      const addedThread = await repository.addThread({
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: THREAD_OWNER_ID,
      });

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123456');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123456',
        title: 'sebuah thread',
        owner: THREAD_OWNER_ID,
      }));
    });
  });

  describe('verifyThreadExist function', () => {
    it('should throw error when thread not found', async () => {
      const repository = new ThreadsRepositoryPostgres(pool);
      await expect(repository.verifyThreadExist('thread-404')).rejects.toThrowError('THREAD_NOT_FOUND');
    });

    it('should not throw error when thread found', async () => {
      await UsersTableTestHelper.addUser({ id: THREAD_OWNER_ID, username: THREAD_OWNER_USERNAME });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: THREAD_OWNER_ID });
      const repository = new ThreadsRepositoryPostgres(pool);

      await expect(repository.verifyThreadExist('thread-123')).resolves.toBe(true);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread detail correctly', async () => {
      await UsersTableTestHelper.addUser({ id: THREAD_OWNER_ID, username: THREAD_OWNER_USERNAME });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'judul thread',
        body: 'isi thread',
        owner: THREAD_OWNER_ID,
      });
      const repository = new ThreadsRepositoryPostgres(pool);

      const thread = await repository.getThreadById('thread-123');

      expect(thread).toMatchObject({
        id: 'thread-123',
        title: 'judul thread',
        body: 'isi thread',
        username: THREAD_OWNER_USERNAME,
      });
      expect(thread.date).toBeDefined();
    });
  });
});

