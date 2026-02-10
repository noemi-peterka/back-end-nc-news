const { fetchTopics, sendTopic } = require("../services/topics_services");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (request, response, next) => {
  const { slug, description } = request.body;
  sendTopic(slug, description)
    .then((topic) => {
      response.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
