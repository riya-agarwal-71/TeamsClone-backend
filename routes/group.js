const express = require("express");
const router = express.Router();

const groupController = require("../controllers/group");

router.post("/create", groupController.create);
router.post("/add-member", groupController.addMember);
router.post("/remove-member", groupController.removeMember);
router.post("/get-messages", groupController.getMessages);
router.post("/delete", groupController.delete);
router.post("/get-participants", groupController.getParticipants);

module.exports = router;
