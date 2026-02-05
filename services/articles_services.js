const {
  modelArticles,
  modelArticlesById,
} = require("../models/articles_model");

const NotFoundError = require("../errors/not_found_error");

exports.fetchArticles = () => {
  return modelArticles();
};

exports.fetchArticlesById = (article_id) => {
  return modelArticlesById(article_id).then((article) => {
    console.log(article);
    if (article.rows.length === 0) {
      throw new NotFoundError("Article ID not found");
    } else {
      return article;
    }
  });
};
