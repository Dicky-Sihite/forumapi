class RepliesHandler {
  constructor({ addReplyUseCase, deleteReplyUseCase, repliesValidator }) {
    this._addReplyUseCase = addReplyUseCase;
    this._deleteReplyUseCase = deleteReplyUseCase;
    this._validator = repliesValidator;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    this._validator.validatePayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addedReply = await this._addReplyUseCase.execute({
      content: request.payload.content,
      threadId,
      commentId,
      owner,
    });

    return h.response({
      status: 'success',
      data: { addedReply },
    }).code(201);
  }

  async deleteReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    await this._deleteReplyUseCase.execute({ owner, threadId, commentId, replyId });

    return h.response({ status: 'success' });
  }
}

module.exports = RepliesHandler;
