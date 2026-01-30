const db = require("../connection");
const format = require("pg-format");
const createLookupObject = require("./utils");

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  emojiData,
  emojiArticleUserData,
  userTopicData,
  userArticleVoteData,
}) => {
  return db
    .query(
      `
    DROP TABLE IF EXISTS emoji_article_user`,
    )
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS comments`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_article_votes`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_topic`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS emojis`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE emojis(
        emoji_id SERIAL PRIMARY KEY, 
        emoji VARCHAR NOT NULL
      )`,
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics(
        slug VARCHAR PRIMARY KEY, 
        description VARCHAR NOT NULL, 
        img_url VARCHAR(1000)
      )`,
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(
        username VARCHAR PRIMARY KEY, 
        name VARCHAR NOT NULL,
        avatar_url VARCHAR(1000)
      )`,
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE user_topic(
        user_topic_id SERIAL PRIMARY KEY, 
        username VARCHAR REFERENCES users(username),
        topic VARCHAR REFERENCES topics(slug)
      )`,
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR REFERENCES topics (slug) NOT NULL,
          author VARCHAR REFERENCES users (username) NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
      )`,
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE user_article_votes(
          user_article_votes_id SERIAL PRIMARY KEY, 
          username VARCHAR REFERENCES users(username), 
          article_id INT REFERENCES articles(article_id),
          vote_count INT NOT NULL
      )`,
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY, 
        article_id INT REFERENCES articles (article_id) NOT NULL,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users (username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE emoji_article_user(
        emoji_article_user_id SERIAL PRIMARY KEY, 
        emoji_id INT REFERENCES emojis(emoji_id), 
        username VARCHAR REFERENCES users(username),
        article_id INT REFERENCES articles(article_id)
        )`,
      );
    })
    .then(() => {
      const formattedEmojis = emojiData.map((emoji) => {
        return [emoji.emoji];
      });

      const queryStr = format(
        `INSERT INTO emojis(emoji) VALUES %L`,
        formattedEmojis,
      );

      return db.query(queryStr);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });

      const queryStr = format(
        `INSERT INTO topics(slug, description, img_url) VALUES %L`,
        formattedTopics,
      );

      return db.query(queryStr);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });

      const queryStr = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L`,
        formattedUsers,
      );

      return db.query(queryStr);
    })
    .then(() => {
      const formattedUserTopics = userTopicData.map((item) => {
        return [item.username, item.topic];
      });

      const queryStr = format(
        `INSERT INTO user_topic(username, topic) VALUES %L`,
        formattedUserTopics,
      );

      return db.query(queryStr);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          article.created_at,
          article.votes,
          article.article_img_url,
        ];
      });

      const queryStr = format(
        `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING article_id, title`,
        formattedArticles,
      );

      return db.query(queryStr);
    })
    .then(({ rows }) => {
      const articles = rows;

      const articlesLookupObject = createLookupObject(
        articles,
        "title",
        "article_id",
      );

      const formattedComments = commentData.map((comment) => {
        return [
          articlesLookupObject[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          comment.created_at,
        ];
      });
      const queryStr = format(
        `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L RETURNING article_id`,
        formattedComments,
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedUserArticleVotes = userArticleVoteData.map((item) => {
        return [item.username, item.article_id, item.vote_count];
      });
      const queryStr = format(
        `INSERT INTO user_article_votes(username, article_id, vote_count) VALUES %L`,
        formattedUserArticleVotes,
      );

      return db.query(queryStr);
    })
    .then(({}) => {
      const formattedEmojiArticleUser = emojiArticleUserData.map((item) => {
        return [item.emoji_id, item.username, item.article_id];
      });
      const queryStr = format(
        `INSERT INTO emoji_article_user(emoji_id, username, article_id) VALUES %L`,
        formattedEmojiArticleUser,
      );
      return db.query(queryStr);
    });
};

module.exports = seed;
