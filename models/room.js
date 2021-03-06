// create the schema forr room
const mongoose = require("mongoose");

// consists of
// url (strign form of the room code)
const roomSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
