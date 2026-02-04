const { modelArticles } = require("../models/articles_model");

exports.fetchArticles = () => {
  return modelArticles();
};
