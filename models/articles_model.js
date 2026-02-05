const db = require("../db/connection");

exports.modelArticles = () => {
  return db
    .query(
      `
      SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments
        ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
      `,
    )
    .then(({ rows }) => rows);
};

exports.modelArticlesById = (article_id) => {
  return db.query(
    `
    SELECT articles.author,
    articles.title, 
    articles.article_id, 
    articles.body, 
    articles.topic,
    articles.created_at, 
    articles.votes, 
    articles.article_img_url
    FROM articles
    WHERE article_id = $1
    `,
    [article_id],
  );
};

exports.modelArticlesCommentsById = (article_id) => {
  return db.query(
    `
    SELECT comments.comment_id, 
    comments.votes, 
    comments.created_at, 
    comments.author, 
    comments.body, 
    comments.article_id
    FROM comments
    WHERE article_id = $1
    `,
    [article_id],
  );
};

exports.modelPostArticlesCommentsById = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [article_id, username, body],
    )
    .then(({ rows }) => rows[0]);
};
