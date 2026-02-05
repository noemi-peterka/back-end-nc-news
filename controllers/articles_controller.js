const {
  fetchArticles,
  fetchArticlesById,
  fetchArticlesCommentsById,
  sendArticlesCommentsById,
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
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticlesCommentsById = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  sendArticlesCommentsById(article_id, { username, body })
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
