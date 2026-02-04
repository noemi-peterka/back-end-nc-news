const express = require("express");
const { getTopics } = require("../controllers/topics_controller");
const router = express.Router();

router.get("/", getTopics);
module.exports = router;
