const express = require("express");
const { getUsers } = require("../controllers/users_controller");
const router = express.Router();

router.get("/", getUsers);
module.exports = router;
