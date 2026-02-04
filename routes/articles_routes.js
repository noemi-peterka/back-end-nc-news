const express = require("express");
const { getArticles } = require("../controllers/articles_controller");
const router = express.Router();

router.get("/", getArticles);
module.exports = router;
