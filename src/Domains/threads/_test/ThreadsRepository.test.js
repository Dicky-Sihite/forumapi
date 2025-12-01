const ThreadsRepository = require('../ThreadsRepository');

describe('ThreadsRepository interface', () => {
  it('should throw error when addThread invoked', async () => {
    const repository = new ThreadsRepository();
    await expect(repository.addThread({})).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyThreadExist invoked', async () => {
    const repository = new ThreadsRepository();
    await expect(repository.verifyThreadExist('thread-123')).rejects.toThrowError('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

