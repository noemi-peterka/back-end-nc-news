const {
  modelTopics,
  modelPostTopic,
  modelTopicExists,
} = require("../models/topics_model");
const NotFoundError = require("../errors/not_found_error");
const BadRequest = require("../errors/bad_request_error");

exports.fetchTopics = () => {
  return modelTopics();
};

exports.sendTopic = (slug, description) => {
  if (!slug || !description) {
    throw new BadRequest("Missing required fields");
  }

  if (typeof slug !== "string" || typeof description !== "string") {
    throw new BadRequest("Invalid field type");
  }

  return modelTopicExists(slug).then((exists) => {
    if (exists) throw new BadRequest("Topic already exists");
    else {
      return modelPostTopic(slug, description).then(({ rows }) => {
        return rows[0];
      });
    }
  });
};
