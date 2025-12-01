const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'sebuah balasan',
    owner = 'user-123',
    commentId = 'comment-123',
    date = new Date().toISOString(),
    isDeleted = false,
  }) {
    const query = {
      text: `
        INSERT INTO replies (id, content, owner, comment_id, date, is_delete)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      values: [id, content, owner, commentId, date, isDeleted],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies');
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = RepliesTableTestHelper;