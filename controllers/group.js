const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");

module.exports.create = async function (req, response) {
  try {
    const { name, participantsStr, fromUser } = req.body;
    let from = await User.findOne({ email: fromUser });
    if (!from) {
      return response.status(200).json({
        data: {
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
      if (!check) {
        return response.status(200).json({
          data: {
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

    if (!newGrp) {
      return response.status(200).json({
        data: {
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

    if (!check) {
      return response.status(200).json({
        data: {
          message: "error in editing the user",
          data: {},
        },
      });
    }

    return response.status(200).json({
      data: {
        message: "Group created successfully",
        data: {
          participants: newGrp.participants,
          name: newGrp.name,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addMember = async function (req, response) {
  try {
    const { byUser, newUser, grpID } = req.body;
    let by = await User.findOne({ email: byUser });
    if (!by) {
      return response.status(200).json({
        data: {
          message: "User not found",
          data: {},
        },
      });
    }
    let toAdd = await User.findOne({ email: newUser });
    if (!toAdd) {
      return response.status(200).json({
        data: {
          message: "User not found",
          data: {},
        },
      });
    }
    let grpToAdd = await Group.findOne({ _id: grpID }).populate(
      "admin",
      "email"
    );
    if (!grpToAdd) {
      return reponses.status(200).json({
        data: {
          message: "Group not found",
          data: {},
        },
      });
    }
    if (grpToAdd.admin.email !== by.email) {
      return response.status(200).json({
        data: {
          message:
            "You are not authorised to add a participant. Only admins can add participants",
          data: {},
        },
      });
    }
    let { err, res } = await Group.updateOne(
      { _id: grpToAdd._id },
      { $addToSet: { participants: [toAdd._id] } }
    );
    if (err) {
      return response.status(200).json({
        data: {
          message: "Error in adding participant",
          data: {},
        },
      });
    }
    let { err: err3, res: res3 } = await User.updateOne(
      { email: newUser },
      { $addToSet: { groups: [grpToAdd._id] } }
    );
    if (err3) {
      return response.status(200).json({
        data: {
          message: "Error in adding participant",
          data: {},
        },
      });
    }

    let groupNow = await Group.findOne({ _id: grpID });

    return response.status(200).json({
      data: {
        message: "Participant added successfully",
        data: {
          participants: groupNow.participants,
          name: groupNow.name,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.removeMember = async function (req, response) {
  try {
    const { toRemove, from, grpID } = req.body;
    let removed = await User.findOne({ email: toRemove });
    if (!removed) {
      return response.status(200).json({
        data: {
          message: "User not found",
          data: {},
        },
      });
    }
    let by = await User.findOne({ email: from });
    if (!by) {
      return response.status(200).json({
        data: {
          message: "User not found",
          data: {},
        },
      });
    }
    let grp = await Group.findOne({ _id: grpID }).populate("admin", "email");
    if (!grp) {
      return response.status(200).json({
        data: {
          message: "Group not found",
          data: {},
        },
      });
    }
    if (grp.admin.email !== from) {
      return response.status(200).json({
        data: {
          message:
            "You cannot remove a participant. Only admins can remove a participant",
          data: {},
        },
      });
    }

    var participants = grp.participants;
    if (!participants.includes(removed._id)) {
      return response.status(200).json({
        data: {
          message: "Participant not present",
          data: {},
        },
      });
    }

    let { err, res } = await User.updateOne(
      { _id: removed._id },
      { $pullAll: { groups: [grpID] } }
    );
    if (err) {
      return response.status(200).json({
        data: {
          message: "Error in removeing grp from user",
          data: {},
        },
      });
    }

    let { err: err2, res: res2 } = await Group.updateOne(
      { _id: grpID },
      { $pullAll: { participants: [removed._id] } }
    );
    if (err2) {
      return response.status(200).json({
        data: {
          message: "Error in deleting participant from group",
          data: {},
        },
      });
    }
    let groupNow = await Group.findOne({ _id: grpID });
    return response.status(200).json({
      data: {
        message: "Participant removed successfully",
        data: {
          participants: groupNow.participants,
          name: groupNow.name,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getMessages = async function (req, response) {
  try {
    const { grpID } = req.body;
    let grp = await Group.findOne({ _id: grpID }).populate("messages", [
      "from",
      "message",
      "createdAt",
    ]);
    if (!grp) {
      return response.status(200).json({
        data: {
          message: "Group not found",
          data: {},
        },
      });
    }
    return response.status(200).json({
      data: {
        message: "Messages found !",
        data: {
          messages: grp.messages,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.delete = async function (req, response) {
  try {
    const { grpID, by } = req.body;
    let byUser = await User.findOne({ email: by });
    if (!byUser) {
      return response.status(200).json({
        data: {
          message: "User not found",
          data: {},
        },
      });
    }
    let grp = await Group.findOne({ _id: grpID });
    if (!grp) {
      return response.status(200).json({
        data: {
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
    if (!check) {
      return response.status(200).json({
        data: {
          message: "Error in deleting group from User",
          data: {},
        },
      });
    }
    let msgs = grp.messages;
    msgs.forEach(async (m) => {
      await Message.deleteOne({ _id: m });
    });
    await Group.deleteOne({ _id: grpID });
    return response.status(200).json({
      data: {
        message: "Group deleted successfully",
        data: {},
      },
    });
  } catch (error) {
    console.log(error);
  }
};
