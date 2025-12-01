const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  /**
   * @param {object} param0
   * @param {threadsRepository} param0.threadsRepository
   * @param {CommentRepository} param0.commentRepository
   */
  constructor({ threadsRepository, commentRepository }) {
  this._threadsRepository = threadsRepository;
  this._commentRepository = commentRepository;
}


  /**
   * execute use case
   * @param {object} useCasePayload { threadId, owner, content }
   */
  async execute(useCasePayload) {
    const { threadId, owner, content } = useCasePayload;

    // Validasikan payload melalui entity
    const addCommentEntity = new AddComment({ content });

    // Verifikasi thread ada
    await this._threadsRepository.verifyThreadExist(threadId);

    // Tambah komentar
    const addedComment = await this._commentRepository.addComment(
      threadId,
      owner,
      addCommentEntity.content,
    );

    return addedComment; // { id, content, owner }
  }
}

module.exports = AddCommentUseCase;
