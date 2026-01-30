const db = require("./connection");

const queries = async () => {
  // Get all of the users
  const select = await db
    .query(`SELECT * FROM users`)
    .then(() => {
      // Get all of the articles where the topic is coding
      return db.query(`SELECT * FROM articles WHERE topic = 'coding'`);
    })
    .then(() => {
      // Get all of the comments where the votes are less than zero
      return db.query(`SELECT * FROM comments WHERE votes < 0`);
    })
    .then(() => {
      // Get all of the topics
      return db.query(`SELECT * FROM topics`);
    })
    .then(() => {
      // Get all of the articles by user grumpy19
      return db.query(`SELECT * FROM articles WHERE author = 'grumpy19'`);
    })
    .then(() => {
      // Get all of the comments that have more than 10 votes.
      return db.query(`SELECT * FROM comments WHERE votes > 10`);
    });
  console.log(select.rows);
};

queries();
