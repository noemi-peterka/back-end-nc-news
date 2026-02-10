const {
  modelArticles,
  modelTopicExists,
  modelArticlesById,
  modelArticlesCommentsById,
  modelPostArticlesCommentsById,
  modelUpdateArticleVotes,
  modelPostArticle,
  modelUserExists,
} = require("../models/articles_model");

const NotFoundError = require("../errors/not_found_error");
const BadRequest = require("../errors/bad_request_error");

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  if (!validSortBy.includes(sort_by)) {
    throw new BadRequest("Invalid sort_by query");
  }

  order = order.toLowerCase();
  if (order !== "asc" && order !== "desc") {
    throw new BadRequest("Invalid order query");
  }

  return modelArticles(sort_by, order, topic).then((articles) => {
    if (topic && articles.length === 0) {
      return modelTopicExists(topic).then((exists) => {
        if (!exists) throw new NotFoundError("Topic not found");
        return [];
      });
    }
    return articles;
  });
};

exports.fetchArticlesById = (article_id) => {
  const id = Number(article_id);

  if (!Number.isInteger(id)) {
    throw new BadRequest("Article ID invalid type");
  }

  return modelArticlesById(id).then((articles) => {
    if (articles.rows.length === 0) {
      throw new NotFoundError("Article ID not found");
    }
    return articles;
  });
};

exports.fetchArticlesCommentsById = (article_id) => {
  const id = Number(article_id);

  if (!Number.isInteger(id)) {
    throw new BadRequest("Article ID invalid type");
  }

  return modelArticlesCommentsById(id).then((comments) => {
    if (comments.rows.length === 0) {
      throw new NotFoundError("Article ID not found");
    }
    return comments.rows;
  });
};

exports.sendArticlesCommentsById = (article_id, author, body) => {
  const id = Number(article_id);
  if (!Number.isInteger(id)) {
    throw new BadRequest("Article ID invalid type");
  }
  if (!author || !body) {
    throw new BadRequest("Missing required fields");
  }

  return modelArticlesById(id).then(({ rows }) => {
    if (rows.length === 0) {
      throw new NotFoundError("Article ID not found");
    }
    return modelPostArticlesCommentsById(id, author, body);
  });
};

exports.sendArticle = (author, title, body, topic, article_img_url) => {
  if (!author || !title || !body || !topic) {
    throw new BadRequest("Missing required fields");
  }

  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string" ||
    (article_img_url !== undefined && typeof article_img_url !== "string")
  ) {
    throw new BadRequest("Invalid field type");
  }

  return Promise.all([modelUserExists(author), modelTopicExists(topic)]).then(
    ([userExists, topicExists]) => {
      if (!userExists) throw new NotFoundError("Author not found");
      if (!topicExists) throw new NotFoundError("Topic not found");

      return modelPostArticle(author, title, body, topic, article_img_url).then(
        ({ rows }) => {
          const article = rows[0];
          return { ...article, comment_count: 0 };
        },
      );
    },
  );
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const id = Number(article_id);
  if (!Number.isInteger(id)) {
    throw new BadRequest("Article ID invalid type");
  }
  if (inc_votes === undefined) throw new BadRequest("Missing required fields");

  if (!Number.isInteger(inc_votes)) throw new BadRequest("Invalid inc_votes");

  return modelArticlesById(id).then(({ rows }) => {
    if (rows.length === 0) {
      throw new NotFoundError("Article ID not found");
    }
    return modelUpdateArticleVotes(id, inc_votes).then(({ rows }) => {
      return rows;
    });
  });
};
