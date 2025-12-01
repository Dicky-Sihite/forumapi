class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('ADD_COMMENT.INVALID_PAYLOAD');
    }

    const { content } = payload;

    if (!content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT.CONTENT_NOT_A_STRING');
    }
  }
}

module.exports = AddComment;
