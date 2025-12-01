class DeleteReplyUseCase {
  constructor({ threadsRepository, commentRepository, replyRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentRepository = commentRepository; // note: kept for DI consistency
    this._replyRepository = replyRepository;
  }

  async execute({ owner, threadId, commentId, replyId }) {
    // verify thread exists
    await this._threadsRepository.verifyThreadExist(threadId);

    // verify comment exists under thread
    await this._commentRepository.verifyCommentAvailable({
      commentId,
      threadId,
    });

    // verify reply exists under the comment
    await this._replyRepository.verifyReplyAvailable({ replyId, commentId });

    // verify reply owner
    await this._replyRepository.verifyReplyOwner({ replyId, owner });

    // soft delete reply
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;