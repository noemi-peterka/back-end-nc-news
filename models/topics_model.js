const db = require("../db/connection");

exports.modelTopics = () => {
  return db
    .query(`SELECT slug, description FROM topics`)
    .then(({ rows }) => rows);
};

exports.modelTopicExists = (topic) => {
  return db
    .query(`SELECT slug FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => rows.length > 0);
};
exports.modelPostTopic = (slug, description) => {
  return db.query(
    `
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *
    `,
    [slug, description],
  );
};
