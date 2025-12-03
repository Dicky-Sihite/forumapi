class CommentsHandler {
  constructor({ addCommentUseCase, deleteCommentUseCase, toggleCommentLikeUseCase }) {
    this._addCommentUseCase = addCommentUseCase;
    this._deleteCommentUseCase = deleteCommentUseCase;
    this._toggleCommentLikeUseCase = toggleCommentLikeUseCase;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload || {};

    const addedComment = await this._addCommentUseCase.execute({
      threadId,
      owner,
      content,
    });

    return h.response({
      status: 'success',
      data: { addedComment },
    }).code(201);
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await this._deleteCommentUseCase.execute({ threadId, commentId, owner });

    return h.response({ status: 'success' }).code(200);
  }

  async putCommentLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await this._toggleCommentLikeUseCase.execute({ threadId, commentId, owner });

    return h.response({ status: 'success' }).code(200);
  }
}

module.exports = CommentsHandler;
