class DeleteCommentUseCase {
  constructor({ threadsRepository, commentRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentRepository = commentRepository;
  }

  /**
   * payload: { threadId, commentId, owner }
   */
  async execute({ threadId, commentId, owner }) {
    // pastikan thread ada
    await this._threadsRepository.verifyThreadExist(threadId);

    // pastikan comment ada di thread
    await this._commentRepository.verifyCommentAvailable({ commentId, threadId });

    // verifikasi owner komentar (akan throw jika bukan owner)
    await this._commentRepository.verifyCommentOwner(commentId, owner);

    // soft delete
    await this._commentRepository.softDeleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
