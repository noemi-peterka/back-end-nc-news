const { getArticles } = require("../models/articles_model");

exports.fetchArticles = () => {
  return getArticles();
};
