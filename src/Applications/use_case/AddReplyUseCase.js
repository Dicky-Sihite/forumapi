const NewReply = require('../../Domains/replies/entities/NewReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class AddReplyUseCase {
  constructor({ threadsRepository, commentRepository, replyRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const newReply = new NewReply(payload);

    // pastikan thread ada
    await this._threadsRepository.verifyThreadExist(newReply.threadId);

    // pastikan comment ada di thread
    await this._commentRepository.verifyCommentAvailable({
      commentId: newReply.commentId,
      threadId: newReply.threadId,
    });

    // simpan reply
    const added = await this._replyRepository.addReply({
      content: newReply.content,
      owner: newReply.owner,
      commentId: newReply.commentId,
    });

    return new AddedReply(added);
  }
}

module.exports = AddReplyUseCase;