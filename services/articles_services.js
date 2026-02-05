const {
  modelArticles,
  modelArticlesById,
  modelArticlesCommentsById,
  modelPostArticlesCommentsById,
} = require("../models/articles_model");

const NotFoundError = require("../errors/not_found_error");
const BadRequest = require("../errors/bad_request_error");

exports.fetchArticles = () => {
  return modelArticles();
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

exports.sendArticlesCommentsById = (article_id) => {
  const id = Number(article_id);
  if (!Number.isInteger(id)) {
    throw new BadRequest("Article ID invalid type");
  }
  modelArticlesById(id).then((articles) => {
    if (articles.rows.length === 0) {
      throw new NotFoundError("Article ID not found");
    } else {
      return modelPostArticlesCommentsById(id, username, body);
    }

    // was working on this one, last bit of task 6
  });
};
