// the main distribution file for the routes
const express = require("express");
const router = express.Router();

// for url/api/users get the ./users file
router.use("/users", require("./users"));
// for url/api/room get the ./room file
router.use("/room", require("./room"));
// for url/api/messages get the ./message file
router.use("/message", require("./message"));
// for url/api/group get the ./group file
router.use("/group", require("./group"));

module.exports = router;
