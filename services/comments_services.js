const {
  modelDeleteCommentById,
  modelCommentExists,
  modelUpdateCommentVotes,
} = require("../models/comments_model");
const NotFoundError = require("../errors/not_found_error");
const BadRequest = require("../errors/bad_request_error");

exports.removeCommentById = (comment_id) => {
  const id = Number(comment_id);

  if (!Number.isInteger(id)) {
    throw new BadRequest("Comment ID invalid type");
  }
  return modelCommentExists(id).then((exists) => {
    if (!exists) {
      throw new NotFoundError("Comment ID not found");
    }
    return modelDeleteCommentById(id);
  });
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  const id = Number(comment_id);

  if (!Number.isInteger(id)) throw new BadRequest("Comment ID invalid type");
  if (inc_votes === undefined) throw new BadRequest("Missing required fields");
  if (!Number.isInteger(inc_votes)) throw new BadRequest("Invalid inc_votes");

  return modelCommentExists(id).then((exists) => {
    if (!exists) throw new NotFoundError("Comment ID not found");
    return modelUpdateCommentVotes(id, inc_votes).then(({ rows }) => rows[0]);
  });
};
