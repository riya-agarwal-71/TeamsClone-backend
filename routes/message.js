// routes for the message api calls
const express = require("express");
const router = express.Router();

// get the messages controller
const messageController = require("../controllers/message");

// for the url/api/message/send call the create function
router.post("/send", messageController.create);
// for the url/api/message/delete call the delete function
router.post("/delete", messageController.delete);

module.exports = router;
