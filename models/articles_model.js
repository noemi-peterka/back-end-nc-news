const db = require("../db/connection");

exports.modelArticles = (sort_by, order, topic, limit, offset) => {
  const orderBy =
    sort_by === "comment_count" ? "comment_count" : `articles.${sort_by}`;

  const values = [];
  let whereClause = "";

  if (topic) {
    values.push(topic);
    whereClause = `WHERE articles.topic = $1`;
  }

  const countQuery = `
    SELECT COUNT(*)::INT AS total_count
    FROM articles
    ${whereClause};
  `;
  const limitParam = topic ? "$2" : "$1";
  const offsetParam = topic ? "$3" : "$2";

  const articlesQuery = `
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.body,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
      ON comments.article_id = articles.article_id
    ${whereClause}
    GROUP BY articles.article_id
    ORDER BY ${orderBy} ${order}
    LIMIT ${limitParam} OFFSET ${offsetParam};
  `;

  const articlesValues = topic ? [topic, limit, offset] : [limit, offset];

  return Promise.all([
    db.query(countQuery, values),
    db.query(articlesQuery, articlesValues),
  ]).then(([countRes, articlesRes]) => {
    return {
      total_count: countRes.rows[0].total_count,
      articles: articlesRes.rows,
    };
  });
};

exports.modelTopicExists = (topic) => {
  return db
    .query(`SELECT slug FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => rows.length > 0);
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

exports.modelPostArticlesCommentsById = (article_id, author, body) => {
  return db
    .query(
      `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [article_id, author, body],
    )
    .then(({ rows }) => rows[0]);
};

exports.modelUpdateArticleVotes = (article_id, inc_votes) => {
  return db.query(
    `
      UPDATE articles
      SET votes = votes + $2
      WHERE article_id = $1
      RETURNING *
    `,
    [article_id, inc_votes],
  );
};

exports.modelUserExists = (username) => {
  return db
    .query(`SELECT username FROM users WHERE username = $1`, [username])
    .then(({ rows }) => rows.length > 0);
};

exports.modelPostArticle = (author, title, body, topic, article_img_url) => {
  if (article_img_url === undefined) {
    article_img_url =
      "https://images.pexels.com/photos/5138715/pexels-photo-5138715.jpeg?_gl=1*1p6moza*_ga*MjEyNTc4NTk0Mi4xNzcwNzM1NTE3*_ga_8JE65Q40S6*czE3NzA3MzU1MTckbzEkZzEkdDE3NzA3MzU1ODUkajYwJGwwJGgw";
  }
  return db.query(
    `
    INSERT INTO articles (author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING article_id, author, title, body, topic, article_img_url, votes, created_at
    `,
    [author, title, body, topic, article_img_url],
  );
};

exports.modelDeleteCommentsByArticleId = (article_id) => {
  return db.query(`DELETE FROM comments WHERE article_id = $1;`, [article_id]);
};

exports.modelDeleteArticle = (article_id) => {
  return db.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *;`, [
    article_id,
  ]);
};
