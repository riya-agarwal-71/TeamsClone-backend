const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message");

router.post("/send", messageController.create);
router.post("/delete", messageController.delete);

module.exports = router;
