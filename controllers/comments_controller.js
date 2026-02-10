const {
  removeCommentById,
  updateCommentVotes,
} = require("../services/comments_services");

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;
  updateCommentVotes(comment_id, inc_votes)
    .then((rows) => {
      response.status(200).send({ comment: rows });
    })
    .catch((err) => {
      next(err);
    });
};
