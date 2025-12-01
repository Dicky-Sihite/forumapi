class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;
    this.content = content;
  }

  _verifyPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('ADD_COMMENT.INVALID_PAYLOAD');
    }

    if (!payload.content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_CONTENT');
    }

    if (typeof payload.content !== 'string') {
      throw new Error('ADD_COMMENT.CONTENT_NOT_A_STRING');
    }
  }
}

module.exports = AddComment;
