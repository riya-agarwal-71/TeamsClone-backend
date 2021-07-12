// controller for the room api calls
const Room = require("../models/room");

// function to create a room
module.exports.create = async function (req, res) {
  try {
    const { roomUrl } = req.body;
    // if room url is null or empty string
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
    // if room already exists
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
    // fi room could not be created
    if (!newRoom) {
      return res.status(500).json({
        data: {
          success: false,
          message: "Error in creating the room",
          data: {},
        },
      });
    }
    // room created successfully
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

// function to check if the room already exists
module.exports.check = async function (req, res) {
  try {
    const { roomUrl } = req.body;
    // if room url is null or empty string
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
    // if room not found
    if (!room) {
      return res.status(200).json({
        data: {
          success: false,
          message: "This room does not exist or the meeting has finished",
          data: {},
        },
      });
    }
    // if room found
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
