// routes for the users api call
const express = require("express");
const router = express.Router();

// get the users controller
const usersController = require("../controllers/users");

// for url/api/users/signup call the userSignUp function
router.post("/signup", usersController.userSignUp);
// for url/api/users/login call the login function
router.post("/login", usersController.login);
// for the url/api/users/groups call teh getGroups function
router.post("/groups", usersController.getGroups);

module.exports = router;
