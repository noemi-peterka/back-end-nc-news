const {
  fetchArticles,
  fetchArticlesById,
  fetchArticlesCommentsById,
} = require("../services/articles_services");

exports.getArticles = (_, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticlesById(article_id)
    .then((article) => {
      response.status(200).send({ article: article.rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesCommentsById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticlesCommentsById(article_id)
    .then((article) => {
      response.status(200).send({ article: article.rows });
    })
    .catch((err) => {
      next(err);
    });
};
