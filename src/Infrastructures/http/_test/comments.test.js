const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

const generateUsername = () => `user${Math.random().toString(36).substring(2, 10)}`;

describe('POST /threads/{threadId}/comments', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const registerAndLogin = async (server) => {
    const username = generateUsername();
    const password = 'secret';

    const registerResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username, password, fullname: 'Dicoding Indonesia' },
    });
    const registerJson = JSON.parse(registerResponse.payload);
    if (registerResponse.statusCode !== 201) {
      throw new Error(`Failed to register user: ${registerResponse.payload}`);
    }
    expect(registerJson.status).toBe('success');

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username, password },
    });
    const loginJson = JSON.parse(loginResponse.payload);
    if (loginResponse.statusCode !== 201) {
      throw new Error(`Failed to login: ${loginResponse.payload}`);
    }
    expect(loginJson.status).toBe('success');

    return { accessToken: loginJson.data.accessToken, username };
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
    expect(threadResponse.statusCode).toBe(201);
    expect(threadJson.status).toBe('success');

    const { addedThread } = threadJson.data;
    return addedThread.id;
  };

  it('should respond 201 and addedComment when request is valid', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: { content: 'sebuah comment' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('success');
    expect(responseJson.data.addedComment).toHaveProperty('id');
    expect(responseJson.data.addedComment.content).toBe('sebuah comment');
    expect(responseJson.data.addedComment).toHaveProperty('owner');
  });

  it('should respond 404 when thread does not exist', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);

    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-unknown/comments',
      payload: { content: 'sebuah comment' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
    expect(resp.message).toBe('thread tidak ditemukan');
  });

  it('should respond 400 when payload invalid', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
    expect(resp.message).toBe('konten komentar tidak boleh kosong');
  });
});
