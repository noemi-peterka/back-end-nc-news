const { getTopics } = require("../models/topics_model");

exports.fetchTopics = () => {
  return getTopics();
};
