// routes for the room api call
const express = require("express");
const router = express.Router();

// get the room controller
const roomController = require("../controllers/room");

// for url/api/room/create call the create function
router.post("/create", roomController.create);
// for url/room/api/check all the check function
router.post("/check", roomController.check);

module.exports = router;
