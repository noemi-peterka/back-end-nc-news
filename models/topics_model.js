const db = require("../db/connection");

exports.modelTopics = () => {
  return db
    .query(`SELECT slug, description FROM topics`)
    .then(({ rows }) => rows);
};
