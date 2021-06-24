const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://user0:40PFWrxwGuLgNKbz@cluster0.65zhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to mongodb"));

db.once("open", function () {
  console.log("connected to Database :: MongoDB :: teamsdb");
});

module.exports = db;
