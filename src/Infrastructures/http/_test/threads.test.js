const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

const generateUsername = () => `user${Math.random().toString(36).substring(2, 10)}`;

describe('POST /threads', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const registerAndLogin = async (server) => {
    const username = generateUsername();
    const password = 'secret';

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username, password, fullname: 'Dicoding Indonesia' },
    });

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username, password },
    });

    const loginJson = JSON.parse(loginResponse.payload);
    return { accessToken: loginJson.data.accessToken, userId: loginJson.data.userId, username };
  };

  it('should respond 201 and addedThread when request is valid', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('success');
    expect(responseJson.data.addedThread).toHaveProperty('id');
    expect(responseJson.data.addedThread.title).toBe('sebuah thread');
    expect(responseJson.data.addedThread).toHaveProperty('owner');
  });

  it('should respond 401 when request without authentication', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it('should respond 400 when request payload missing title', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        body: 'sebuah body thread',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('fail');
  });

  it('should respond 400 when request payload missing body', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('fail');
  });
});

describe('GET /threads/{threadId}', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const registerAndLogin = async (server) => {
    const username = generateUsername();
    const password = 'secret';

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username, password, fullname: 'Dicoding Indonesia' },
    });

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username, password },
    });

    const loginJson = JSON.parse(loginResponse.payload);
    return { accessToken: loginJson.data.accessToken, userId: loginJson.data.userId, username };
  };

  const createThread = async (server, accessToken) => {
    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'sebuah thread',
        body: 'sebuah body',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const threadJson = JSON.parse(threadResponse.payload);
    return threadJson.data.addedThread.id;
  };

  it('should respond 200 and return thread detail correctly', async () => {
    const server = await createServer(container);
    const { accessToken, username } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);

    const response = await server.inject({
      method: 'GET',
      url: `/threads/${threadId}`,
    });

    expect(response.statusCode).toBe(200);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('success');
    expect(responseJson.data.thread).toHaveProperty('id');
    expect(responseJson.data.thread.id).toBe(threadId);
    expect(responseJson.data.thread.title).toBe('sebuah thread');
    expect(responseJson.data.thread.body).toBe('sebuah body');
    expect(responseJson.data.thread.username).toBe(username);
    expect(responseJson.data.thread).toHaveProperty('date');
    expect(responseJson.data.thread.comments).toEqual([]);
  });

  it('should respond 404 when thread not found', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'GET',
      url: '/threads/thread-xxx',
    });

    expect(response.statusCode).toBe(404);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('fail');
    expect(responseJson.message).toBe('thread tidak ditemukan');
  });

  afterAll(async () => {
    await pool.end();
  });
});
