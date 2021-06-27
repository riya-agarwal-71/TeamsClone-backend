const Room = require("../models/room");

module.exports.create = async function (req, res) {
  try {
    const { roomUrl } = req.body;
    if (!roomUrl || roomUrl === "") {
      return res.status(200).json({
        data: {
          success: false,
          message: "No url provided",
          data: {},
        },
      });
    }
    let room = await Room.findOne({ url: roomUrl });
    if (room) {
      return res.status(200).json({
        data: {
          success: false,
          message: "Room with this code already exists",
          data: {},
        },
      });
    }
    let newRoom = await Room.create({
      url: roomUrl,
    });
    if (!newRoom) {
      return res.status(500).json({
        data: {
          success: false,
          message: "Error in creating the room",
          data: {},
        },
      });
    }
    return res.status(200).json({
      data: {
        success: true,
        message: "New room created",
        data: {
          roomUrl,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.check = async function (req, res) {
  try {
    const { roomUrl } = req.body;
    if (!roomUrl || roomUrl === "") {
      return res.status(200).json({
        data: {
          success: false,
          message: "Room url not provided",
          data: {},
        },
      });
    }
    let room = await Room.findOne({ url: roomUrl });
    if (!room) {
      return res.status(200).json({
        data: {
          success: false,
          message: "This room does not exist or the meeting has finished",
          data: {},
        },
      });
    }
    return res.status(200).json({
      data: {
        success: true,
        message: "Room exists",
        data: {
          roomUrl,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};
