const db = require("../connection");
const format = require("pg-format");
const createRef = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
          slug VARCHAR(200) PRIMARY KEY,
          description VARCHAR(1000),
          img_url VARCHAR(1000)
        )`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users(
          username VARCHAR PRIMARY KEY,
          name VARCHAR,
          avatar_url VARCHAR(1000)
        )`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles(
          article_id SERIAL PRIMARY KEY,
          title VARCHAR,
          topic VARCHAR REFERENCES topics(slug),
          author VARCHAR REFERENCES users(username),
          body TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        )`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id) NOT NULL,
          body TEXT,
          votes INT DEFAULT 0,
          author VARCHAR REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    })
    .then(() => {
      const formattedTopics = topicData.map(
        ({ slug, description, img_url }) => {
          return [slug, description, img_url];
        },
      );
      const sqlString = format(
        `INSERT INTO topics(slug, description, img_url) VALUES %L`,
        formattedTopics,
      );
      return db.query(sqlString);
    })
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });
      const sqlString = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L`,
        formattedUsers,
      );
      return db.query(sqlString);
    })
    .then(() => {
      const formattedArticles = articleData.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => {
          return [
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          ];
        },
      );
      const sqlString = format(
        `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles,
      );
      return db.query(sqlString);
    })
    .then(({ rows }) => {
      const articles = rows;
      const articleIdLookup = createRef(articles, "title", "article_id");

      const formattedComments = commentData.map((comment) => {
        return [
          articleIdLookup[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          comment.created_at,
        ];
      });

      const queryStr = format(
        `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments,
      );

      return db.query(queryStr);
    });
};
module.exports = seed;
