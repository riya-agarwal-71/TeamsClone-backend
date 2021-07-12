// create the group schema
const mongoose = require("mongoose");

// fileds are -
// name (the name of the group)
// participants (array) (refrence of the participants (user schema) of the group)
// admin (refrence of the admin ie creator (user schema) of the group)
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
