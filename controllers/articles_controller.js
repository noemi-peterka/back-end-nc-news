const {
  fetchArticles,
  fetchArticlesById,
  fetchArticlesCommentsById,
  sendArticlesCommentsById,
  updateArticleVotes,
} = require("../services/articles_services");

exports.getArticles = (request, response, next) => {
  const { sort_by, order } = request.query;
  fetchArticles(sort_by, order)
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
  const { author, body } = request.body;
  sendArticlesCommentsById(article_id, author, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticleVotes(article_id, inc_votes)
    .then((rows) => {
      response.status(200).send({ article: rows });
    })
    .catch(next);
};
