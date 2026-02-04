const { modelUsers } = require("../models/users_model");

exports.fetchUsers = () => {
  return modelUsers();
};
