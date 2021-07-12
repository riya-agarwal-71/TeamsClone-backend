// connect to mongodb - teamsdb
const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/teamsdb"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to mongodb"));

db.once("open", function () {
  console.log("connected to Database :: MongoDB :: teamsdb");
});

module.exports = db;
