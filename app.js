const express = require("express");
// Create the server
const app = express();

// Setup, use JSON
app.use(express.json());

// Set up the routers
const topicsRouter = require("./routes/topics_routes");
app.use("/api/topics", topicsRouter);

const articlesRouter = require("./routes/articles_routes");
app.use("/api/articles", articlesRouter);

module.exports = app;
