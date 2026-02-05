const {
  fetchArticles,
  fetchArticlesById,
} = require("../services/articles_services");

exports.getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
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
