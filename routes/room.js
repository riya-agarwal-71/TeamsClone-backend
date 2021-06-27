const express = require("express");
const router = express.Router();

const roomController = require("../controllers/room");

router.post("/create", roomController.create);
router.post("/delete", roomController.delete);
router.post("/check", roomController.check);

module.exports = router;
