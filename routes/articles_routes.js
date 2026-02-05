const express = require("express");
const {
  getArticles,
  getArticlesById,
} = require("../controllers/articles_controller");
const router = express.Router();

router.get("/", getArticles);
router.get("/:article_id", getArticlesById);
module.exports = router;
