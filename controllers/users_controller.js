const {
  fetchUsers,
  fetchUserByUsername,
} = require("../services/users_services");

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user: user.rows });
    })
    .catch((err) => {
      next(err);
    });
};
