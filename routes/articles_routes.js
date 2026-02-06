const express = require("express");
const {
  getArticles,
  getArticlesById,
  getArticlesCommentsById,
  postArticlesCommentsById,
  patchArticleById,
} = require("../controllers/articles_controller");
const router = express.Router();

router.get("/", getArticles);
router.get("/:article_id/comments", getArticlesCommentsById);
router.get("/:article_id", getArticlesById);
router.patch("/:article_id", patchArticleById);
router.post("/:article_id/comments", postArticlesCommentsById);
module.exports = router;
