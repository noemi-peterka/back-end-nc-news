const { modelTopics } = require("../models/topics_model");

exports.fetchTopics = () => {
  return modelTopics();
};
