const Room = require("../models/room");

module.exports.deleteRoomID = async function (roomUrl) {
  try {
    if (!roomUrl || roomUrl === "") {
      return;
    }
    let room = await Room.findOne({ url: roomUrl });
    if (!room) {
      return;
    }
    await Room.deleteOne({ url: roomUrl });
    return;
  } catch (error) {
    console.log(error);
  }
};
