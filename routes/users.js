const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

router.post("/signup", usersController.userSignUp);
router.post("/login", usersController.login);
router.post("/groups", usersController.getGroups);

module.exports = router;
