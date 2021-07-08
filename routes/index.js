const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/room", require("./room"));
router.use("/message", require("./message"));
router.use("/group", require("./group"));

module.exports = router;
