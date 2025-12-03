const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, owner, content) {
    const id = `comment-${this._idGenerator(16)}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO comments (id, content, thread_id, owner, date, is_delete)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, content, owner
      `,
      values: [id, content, threadId, owner, date, false],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT comments.id, comments.content, comments.date, comments.is_delete, users.username
        FROM comments
        LEFT JOIN users ON users.id = comments.owner
        WHERE comments.thread_id = $1
        ORDER BY comments.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows; // each row has { id, content, date, is_delete, username }
  }

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT id, content, owner, thread_id, date, is_delete FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyCommentOwner(commentId, owner) {
    const comment = await this.getCommentById(commentId);
    if (!comment) {
      throw new Error('COMMENT_NOT_FOUND');
    }
    if (comment.owner !== owner) {
      throw new Error('COMMENT_NOT_OWNER');
    }
    return true;
  }

  async softDeleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyCommentAvailable({ commentId, threadId }) {
    const comment = await this.getCommentById(commentId);
    if (!comment) {
      throw new Error('COMMENT_NOT_FOUND');
    }
    if (comment.thread_id !== threadId) {
      throw new Error('COMMENT_NOT_FOUND');
    }
    return true;
  }

  async addCommentLike(commentId, userId) {
    const id = `comment_likes-${this._idGenerator(16)}`;
    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, user_id) VALUES ($1, $2, $3)',
      values: [id, commentId, userId],
    };
    await this._pool.query(query);
  }

  async removeCommentLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async isCommentLiked(commentId, userId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getCommentLikeCount(commentId) {
    const query = {
      text: 'SELECT COUNT(*) AS count FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return Number(result.rows[0].count || 0);
  }
}

module.exports = CommentRepositoryPostgres;
