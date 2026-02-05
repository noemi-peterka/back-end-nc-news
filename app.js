const express = require("express");
const topicsRouter = require("./routes/topics_routes");
const articlesRouter = require("./routes/articles_routes");
const usersRouter = require("./routes/users_routes.js");
const app = express();
const NotFoundError = require("./errors/not_found_error.js");
const BadRequest = require("./errors/bad_request_error.js");

app.use(express.json());

app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);

app.use((err, request, response, next) => {
  if (err instanceof NotFoundError) {
    response.status(404).send({ msg: err.message });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err instanceof BadRequest) {
    response.status(400).send({ msg: err.message });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
