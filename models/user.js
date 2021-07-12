// create the user schema
const mongoose = require("mongoose");

// consists of
// name (string form of the name of teh user)
// email (string form of the email of the user)
// password (string form of the password set by the user)
// groups (array) (refrence of all teh groups (group schema) which the user is part of)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
