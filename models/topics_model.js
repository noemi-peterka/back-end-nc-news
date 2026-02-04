const db = require("../db/connection");

exports.getTopics = () => {
  return db
    .query(`SELECT slug, description FROM topics`)
    .then(({ rows }) => rows);
};
