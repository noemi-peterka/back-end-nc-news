const {
  modelDeleteCommentById,
  modelCommentExists,
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
