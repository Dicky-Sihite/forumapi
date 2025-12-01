class GetThreadDetailUseCase {
  constructor({ threadsRepository, commentRepository, replyRepository }) {
    this._threadsRepository = threadsRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    // Pastikan thread ada
    await this._threadsRepository.verifyThreadExist(threadId);

    // Ambil detail thread
    const thread = await this._threadsRepository.getThreadById(threadId);

    // Ambil semua komentar
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    // Untuk setiap komentar, ambil replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

        // Format replies: jika is_delete true, tampilkan pesan dihapus
        const formattedReplies = replies.map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.date,
          content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
        }));

        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          replies: formattedReplies,
        };
      })
    );

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: commentsWithReplies,
    };
  }
}

module.exports = GetThreadDetailUseCase;
