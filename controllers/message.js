const Message = require("../models/message");
const Group = require("../models/group");
const User = require("../models/user");

module.exports.create = async function (req, response) {
  try {
    const { fromUser, toGrpID, message } = req.body;
    let from = await User.findOne({ email: fromUser });
    if (!from) {
      return response.status(200).json({
        data: {
          message: "User not found",
          data: {},
        },
      });
    }
    let toGroup = await Group.findOne({ _id: toGrpID });
    if (!toGroup) {
      return response.status(200).json({
        data: {
          message: "Group not found",
          data: {},
        },
      });
    }
    let newMessage = await Message.create({
      from: from._id,
      to: toGrpID,
      message: message,
    });
    if (!newMessage) {
      return response.status(200).json({
        data: {
          messgage: "Error in creating the message try again later",
          data: {},
        },
      });
    }

    let { err, res } = await Group.updateOne(
      { _id: toGrpID },
      { $addToSet: { messages: [newMessage._id] } }
    );

    if (err) {
      return response.status(200).json({
        data: {
          message: "Error in adding message to group",
          data: {},
        },
      });
    }

    return response.status(200).json({
      data: {
        message: "Message Sent successfully",
        data: {
          form: fromUser,
          to: toGrpID,
          msg: message,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.delete = async function (req, response) {
  try {
    const { fromUser, message, grpID } = req.body;
    const grp = await Group.findOne({ _id: grpID });
    if (!grp) {
      return response.status(200).json({
        data: {
          message: "Room not found",
          data: {},
        },
      });
    }
    const from = await User.findOne({ email: fromUser });
    if (!from) {
      return response.status(200).json({
        data: {
          message: "User not found",
          data: {},
        },
      });
    }
    const msg = await Message.findOne({
      from: from._id,
      message: message,
      to: room._id,
    });
    if (!msg) {
      return response.status(200).json({
        data: {
          message: "message not found",
          data: {},
        },
      });
    }
    let { err, res } = await Group.updateOne(
      { _id, grpID },
      { $pullAll: { messages: [msg._id] } }
    );
    if (err) {
      return response.status(200).json({
        data: {
          message: "Error in deleting message from group",
          data: {},
        },
      });
    }
    await Message.deleteOne({ from: from._id, message: message, to: room._id });
    return response.status(200).json({
      data: {
        message: "Message deleted successfully",
        data: {
          msg,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
