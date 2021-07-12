// create the message schema
const mongoose = require("mongoose");

// schema to store the messages consists of
// from (refrence of the sender (user schema))
// to (refrence of the destination (group schema))
// message (the string form of the actual message)
const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
