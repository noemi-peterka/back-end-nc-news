const db = require("../db/connection");

exports.modelUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => rows);
};

exports.modelUserByUsername = (username) => {
  return db.query(
    `
    SELECT *
    FROM users
    WHERE username = $1
    `,
    [username],
  );
};
