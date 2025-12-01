const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

const generateUsername = () => `user${Math.random().toString(36).substring(2, 10)}`;

describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const registerAndLogin = async (server) => {
    const username = generateUsername();
    const password = 'secret';

    const registerResponse = await server.inject({
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
    return threadJson.data.addedThread.id;
  };

  const createComment = async (server, threadId, accessToken) => {
    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: { content: 'sebuah comment' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const commentJson = JSON.parse(commentResponse.payload);
    return commentJson.data.addedComment.id;
  };

  it('should respond 201 and addedReply when request is valid', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);
    const commentId = await createComment(server, threadId, accessToken);

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: { content: 'sebuah balasan' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('success');
    expect(responseJson.data.addedReply).toHaveProperty('id');
    expect(responseJson.data.addedReply.content).toBe('sebuah balasan');
    expect(responseJson.data.addedReply).toHaveProperty('owner');
  });

  it('should respond 404 when thread does not exist', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);

    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-unknown/comments/comment-unknown/replies',
      payload: { content: 'sebuah balasan' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
    expect(resp.message).toBe('thread tidak ditemukan');
  });

  it('should respond 404 when comment does not exist', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/comment-unknown/replies`,
      payload: { content: 'sebuah balasan' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
    expect(resp.message).toBe('comment tidak ditemukan');
  });

  it('should respond 400 when payload invalid', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);
    const commentId = await createComment(server, threadId, accessToken);

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(400);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
    expect(resp.message).toBe('tidak dapat menambah reply karena properti yang dibutuhkan tidak ada');
  });

  it('should respond 401 when access token missing', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);
    const commentId = await createComment(server, threadId, accessToken);

    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: { content: 'sebuah balasan' },
    });

    expect(response.statusCode).toBe(401);
  });
});

describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const registerAndLogin = async (server) => {
    const username = generateUsername();
    const password = 'secret';

    const registerResponse = await server.inject({
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
    return threadJson.data.addedThread.id;
  };

  const createComment = async (server, threadId, accessToken) => {
    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: { content: 'sebuah comment' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const commentJson = JSON.parse(commentResponse.payload);
    return commentJson.data.addedComment.id;
  };

  const createReply = async (server, threadId, commentId, accessToken) => {
    const replyResponse = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: { content: 'sebuah balasan' },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const replyJson = JSON.parse(replyResponse.payload);
    return replyJson.data.addedReply.id;
  };

  it('should respond 200 when delete reply is successful', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);
    const commentId = await createComment(server, threadId, accessToken);
    const replyId = await createReply(server, threadId, commentId, accessToken);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.status).toBe('success');
  });

  it('should respond 404 when thread does not exist', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);

    const response = await server.inject({
      method: 'DELETE',
      url: '/threads/thread-unknown/comments/comment-unknown/replies/reply-unknown',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
  });

  it('should respond 404 when comment does not exist', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/comment-unknown/replies/reply-unknown`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should respond 404 when reply does not exist', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);
    const commentId = await createComment(server, threadId, accessToken);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/reply-unknown`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
  });

  it('should respond 403 when user not authorized (not reply owner)', async () => {
    const server = await createServer(container);
    const { accessToken: accessToken1 } = await registerAndLogin(server);
    const { accessToken: accessToken2 } = await registerAndLogin(server);

    const threadId = await createThread(server, accessToken1);
    const commentId = await createComment(server, threadId, accessToken1);
    const replyId = await createReply(server, threadId, commentId, accessToken1);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      headers: {
        Authorization: `Bearer ${accessToken2}`,
      },
    });

    expect(response.statusCode).toBe(403);
    const resp = JSON.parse(response.payload);
    expect(resp.status).toBe('fail');
    expect(resp.message).toBe('anda tidak berhak mengakses resource ini');
  });

  it('should respond 401 when access token missing', async () => {
    const server = await createServer(container);
    const { accessToken } = await registerAndLogin(server);
    const threadId = await createThread(server, accessToken);
    const commentId = await createComment(server, threadId, accessToken);
    const replyId = await createReply(server, threadId, commentId, accessToken);

    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
    });

    expect(response.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await pool.end();
});
