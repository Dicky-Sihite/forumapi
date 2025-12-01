/* eslint-disable camelcase */

exports.up = pgm => {
  // Add foreign key constraints to comments table
  pgm.addConstraint('comments', 'fk_comments.thread_id_threads_id', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('comments', 'fk_comments.owner_users_id', {
    foreignKeys: {
      columns: 'owner',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = pgm => {
  pgm.dropConstraint('comments', 'fk_comments.owner_users_id');
  pgm.dropConstraint('comments', 'fk_comments.thread_id_threads_id');
};
