/* eslint-disable no-unused-vars */

class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, commentId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (!payload) {
      throw new Error('NEW_REPLY.INVALID_PAYLOAD');
    }

    if (!payload.content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_CONTENT');
    }

    if (typeof payload.content !== 'string') {
      throw new Error('NEW_REPLY.CONTENT_NOT_STRING');
    }

    // threadId, commentId, owner will be validated in use case / handler
  }
}

module.exports = NewReply;