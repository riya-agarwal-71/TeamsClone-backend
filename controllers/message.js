// controller to respond to the message api calls
const Message = require("../models/message");
const Group = require("../models/group");
const User = require("../models/user");

// function to create a message
module.exports.create = async function (req, response) {
  try {
    const { fromUser, toGrpID, message } = req.body;
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
    let toGroup = await Group.findOne({ _id: toGrpID });
    // if group not found
    if (!toGroup) {
      return response.status(200).json({
        data: {
          success: false,
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
    // if new message could not be created
    if (!newMessage) {
      return response.status(200).json({
        data: {
          success: false,
          messgage: "Error in creating the message try again later",
          data: {},
        },
      });
    }

    let newMsg = await Message.findOne({ _id: newMessage._id }).populate({
      path: "from",
      select: ["name", "email"],
    });

    let { err, res } = await Group.updateOne(
      { _id: toGrpID },
      { $addToSet: { messages: [newMessage._id] } }
    );

    // if new message could not be added in the group schema
    if (err) {
      return response.status(200).json({
        data: {
          success: false,
          message: "Error in adding message to group",
          data: {},
        },
      });
    }

    // message created successfully
    return response.status(200).json({
      data: {
        success: true,
        message: "Message Sent successfully",
        data: {
          msg: newMsg,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// function to delete a message
module.exports.delete = async function (req, response) {
  try {
    const { fromUser, message, grpID } = req.body;
    const grp = await Group.findOne({ _id: grpID });
    // if group not found
    if (!grp) {
      return response.status(200).json({
        data: {
          message: "Room not found",
          data: {},
        },
      });
    }
    const from = await User.findOne({ email: fromUser });
    // if user not found
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
    // if message not found
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
    // if message could not be deleted from the group schema
    if (err) {
      return response.status(200).json({
        data: {
          message: "Error in deleting message from group",
          data: {},
        },
      });
    }
    // delete the message
    await Message.deleteOne({ from: from._id, message: message, to: room._id });
    // message deleted successfully
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
