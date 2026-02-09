const { modelUsers, modelUserByUsername } = require("../models/users_model");
const NotFoundError = require("../errors/not_found_error");
const BadRequest = require("../errors/bad_request_error");

exports.fetchUsers = () => {
  return modelUsers();
};

exports.fetchUserByUsername = (username) => {
  return modelUserByUsername(username).then((user) => {
    console.log(user);
    if (user.rows.length === 0) {
      throw new NotFoundError("Username not found");
    }
    return user;
  });
};
