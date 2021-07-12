// controller for the group api calls
const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");

// function to create a group
module.exports.create = async function (req, response) {
  try {
    const { name, participantsStr, fromUser } = req.body;
    let from = await User.findOne({ email: fromUser });
    // if user not found
    if (!from) {
      return response.status(200).json({
        data: {
          success: false,
          message: "User not found",
          data: {},
        },
      });
    }
    let participants;
    if (participantsStr) {
      participants = participantsStr.split(",");
    } else {
      participants = [];
    }
    let participantsIds = [from._id];
    var check = true;
    participants.forEach(async (p) => {
      let participantUser = await User.findOne({ email: p });
      if (!participantUser) {
        check = false;
        return;
      }
      // if a participant not found
      if (!check) {
        return response.status(200).json({
          data: {
            success: false,
            message: "Group not created as user not found",
            data: {},
          },
        });
      }
      participantsIds.append(participantUser._id);
    });

    let newGrp = await Group.create({
      name,
      participants: participantsIds,
      admin: from._id,
    });

    // if new group could not be created
    if (!newGrp) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Group could not be created. Try again later",
          data: {},
        },
      });
    }

    var check = true;
    participantsIds.forEach(async (id) => {
      let { err, res } = await User.updateOne(
        { _id: id },
        { $addToSet: { groups: [newGrp._id] } }
      );
      if (err) {
        check = false;
        return;
      }
    });

    // if group could not be added in the participant user scema
    if (!check) {
      return response.status(200).json({
        data: {
          success: false,
          message: "error in editing the user",
          data: {},
        },
      });
    }

    // successfull group creation
    return response.status(200).json({
      data: {
        success: true,
        message: "Group created successfully",
        data: {
          grp: newGrp,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// function to add a member in a group
module.exports.addMember = async function (req, response) {
  try {
    const { byUser, newUser, grpID } = req.body;
    let by = await User.findOne({ email: byUser });
    // if user not found
    if (!by) {
      return response.status(200).json({
        data: {
          succesS: false,
          message: "User not found",
          data: {},
        },
      });
    }
    let toAdd = await User.findOne({ email: newUser });
    // if user not found
    if (!toAdd) {
      return response.status(200).json({
        data: {
          success: false,
          message: "User not found",
          data: {},
        },
      });
    }
    let grpToAdd = await Group.findOne({ _id: grpID }).populate(
      "admin",
      "email"
    );
    // if group not found
    if (!grpToAdd) {
      return reponses.status(200).json({
        data: {
          success: false,
          message: "Group not found",
          data: {},
        },
      });
    }
    // if the person generating the add request not teh admin of the group
    if (grpToAdd.admin.email !== by.email) {
      return response.status(200).json({
        data: {
          success: false,
          message:
            "You are not authorised to add a participant. Only admins can add participants",
          data: {},
        },
      });
    }

    // if participant already exists in the group
    var participants = grpToAdd.participants;
    if (participants.includes(toAdd._id)) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Participant already exists in the group",
          data: {},
        },
      });
    }

    let { err, res } = await Group.updateOne(
      { _id: grpToAdd._id },
      { $addToSet: { participants: [toAdd._id] } }
    );
    // if participant could not be added in the group schema
    if (err) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Error in adding participant",
          data: {},
        },
      });
    }
    let { err: err3, res: res3 } = await User.updateOne(
      { email: newUser },
      { $addToSet: { groups: [grpToAdd._id] } }
    );
    // if group could not be added in the user schema
    if (err3) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Error in adding participant",
          data: {},
        },
      });
    }

    let groupNow = await Group.findOne({ _id: grpID });

    // successfull group creation
    return response.status(200).json({
      data: {
        success: true,
        message: "Participant added successfully",
        data: {
          participants: groupNow.participants,
          name: groupNow.name,
          id: groupNow._id,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// function to remove memeber from the group
module.exports.removeMember = async function (req, response) {
  try {
    const { toRemove, from, grpID } = req.body;
    let removed = await User.findOne({ email: toRemove });
    // user not found
    if (!removed) {
      return response.status(200).json({
        data: {
          sucess: false,
          message: "User not found",
          data: {},
        },
      });
    }
    let by = await User.findOne({ email: from });
    // user not found
    if (!by) {
      return response.status(200).json({
        data: {
          success: false,
          message: "User not found",
          data: {},
        },
      });
    }
    let grp = await Group.findOne({ _id: grpID }).populate("admin", "email");
    // if group not found
    if (!grp) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Group not found",
          data: {},
        },
      });
    }
    // if the person removing the participant is not the admin of the group
    if (grp.admin.email !== from) {
      return response.status(200).json({
        data: {
          success: false,
          message:
            "You cannot remove a participant. Only admins can remove a participant",
          data: {},
        },
      });
    }

    // if participant is not present in the group
    var participants = grp.participants;
    if (!participants.includes(removed._id)) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Participant not present",
          data: {},
        },
      });
    }

    let { err, res } = await User.updateOne(
      { _id: removed._id },
      { $pullAll: { groups: [grpID] } }
    );
    // if group could not be deleted from the user schema
    if (err) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Error in removing grp from user",
          data: {},
        },
      });
    }

    let { err: err2, res: res2 } = await Group.updateOne(
      { _id: grpID },
      { $pullAll: { participants: [removed._id] } }
    );
    // if user could not be deleted from the group schema
    if (err2) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Error in deleting participant from group",
          data: {},
        },
      });
    }
    // successfully removed the member from the group
    let groupNow = await Group.findOne({ _id: grpID });
    return response.status(200).json({
      data: {
        success: true,
        message: "Participant removed successfully",
        data: {
          participants: groupNow.participants,
          name: groupNow.name,
          id: groupNow._id,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// function to get all the participants from the group
module.exports.getParticipants = async function (req, response) {
  try {
    const { grpID } = req.body;
    let grp = await Group.findOne({ _id: grpID })
      .populate({
        path: "admin",
        select: ["name", "email"],
      })
      .populate({
        path: "participants",
        select: ["name", "email"],
      });
    // group not found
    if (!grp) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Group not found",
          data: {},
        },
      });
    }
    // participants found successfully
    return response.status(200).json({
      data: {
        success: true,
        message: "Participants found !",
        data: {
          participants: grp.participants,
          id: grp._id,
          admin: grp.admin,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// function to get the messages in a group
module.exports.getMessages = async function (req, response) {
  try {
    const { grpID } = req.body;
    let grp = await Group.findOne({ _id: grpID }).populate({
      path: "messages",
      populate: { path: "from", select: ["email", "name"] },
    });
    // group not found
    if (!grp) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Group not found",
          data: {},
        },
      });
    }
    // messages found successfully
    return response.status(200).json({
      data: {
        success: true,
        message: "Messages found !",
        data: {
          messages: grp.messages,
          id: grp._id,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// function to delete the group
module.exports.delete = async function (req, response) {
  try {
    const { grpID, by } = req.body;
    let byUser = await User.findOne({ email: by });
    // if user not found
    if (!byUser) {
      return response.status(200).json({
        data: {
          success: false,
          message: "User not found",
          data: {},
        },
      });
    }
    let grp = await Group.findOne({ _id: grpID });
    // if group not found
    if (!grp) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Group not found",
          data: {},
        },
      });
    }
    let participants = grp.participants;
    var check = true;
    participants.forEach(async (p) => {
      let { err, res } = await User.updateOne(
        { _id: p._id },
        { $pullAll: { groups: [grpID] } }
      );
      if (err) {
        check = false;
        return;
      }
    });
    // if group could not be removed from teh user schema
    if (!check) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Error in deleting group from User",
          data: {},
        },
      });
    }
    let msgs = grp.messages;
    // delete all the messages from the group
    msgs.forEach(async (m) => {
      await Message.deleteOne({ _id: m });
    });
    // delete the group
    await Group.deleteOne({ _id: grpID });
    // group deleted successfully
    return response.status(200).json({
      data: {
        success: true,
        message: "Group deleted successfully",
        data: {
          id: grpID,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
