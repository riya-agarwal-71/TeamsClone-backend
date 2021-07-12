// function to delete the room from the db
// when all the users leave the meeting then delete the room from the database
const Room = require("../models/room");

module.exports.deleteRoomID = async function (roomUrl) {
  try {
    if (!roomUrl || roomUrl === "") {
      return;
    }
    let room = await Room.findOne({ url: roomUrl });
    // room not found
    if (!room) {
      return;
    }
    // delete the room
    await Room.deleteOne({ url: roomUrl });
    return;
  } catch (error) {
    console.log(error);
  }
};
