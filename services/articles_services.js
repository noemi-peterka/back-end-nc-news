const {
  modelArticles,
  modelArticlesById,
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

  return modelArticlesById(id).then((article) => {
    if (article.rows.length === 0) {
      throw new NotFoundError("Article ID not found");
    }
    return article;
  });
};
