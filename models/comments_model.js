const db = require("../db/connection");

exports.modelCommentExists = (comment_id) => {
  return db
    .query(`SELECT 1 FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => rows.length > 0);
};

exports.modelDeleteCommentById = (comment_id) => {
  return db.query(
    `
        DELETE FROM comments WHERE comment_id = $1
        `,
    [comment_id],
  );
};
