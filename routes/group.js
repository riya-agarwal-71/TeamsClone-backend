// routes for the group api call
const express = require("express");
const router = express.Router();

// get the controller
const groupController = require("../controllers/group");

// for url/api/group/create call the create function
router.post("/create", groupController.create);
// for url/api/group/add-member call the addMemeber function
router.post("/add-member", groupController.addMember);
// for url/api/group/remove-member call the removeMember function
router.post("/remove-member", groupController.removeMember);
// for url/api/group/get-messages call the getMessages function
router.post("/get-messages", groupController.getMessages);
// for url/api/group/delete call the delete function
router.post("/delete", groupController.delete);
// for url/api/group/get-participants call the getParticipants function
router.post("/get-participants", groupController.getParticipants);

module.exports = router;
