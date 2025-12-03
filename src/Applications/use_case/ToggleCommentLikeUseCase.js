class ToggleCommentLikeUseCase {
  constructor({ threadsRepository, commentRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentRepository = commentRepository;
  }

  /**
   * payload: { threadId, commentId, owner }
   */
  async execute({ threadId, commentId, owner }) {
    // ensure thread exists
    await this._threadsRepository.verifyThreadExist(threadId);

    // ensure comment exists in thread
    await this._commentRepository.verifyCommentAvailable({ commentId, threadId });

    // check if user already liked the comment
    const liked = await this._commentRepository.isCommentLiked(commentId, owner);

    if (liked) {
      // unlike
      await this._commentRepository.removeCommentLike(commentId, owner);
    } else {
      // like
      await this._commentRepository.addCommentLike(commentId, owner);
    }
  }
}

module.exports = ToggleCommentLikeUseCase;
