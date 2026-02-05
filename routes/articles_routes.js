const express = require("express");
const {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
} = require("../controllers/articles_controller");
const router = express.Router();

router.get("/", getArticles);
router.get("/:article_id/comments", getArticlesCommentsById);
router.get("/:article_id", getArticlesById);
module.exports = router;
