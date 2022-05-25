// the entry point of the backend of the application
const express = require("express");
const cors = require("cors");
// the port is wither the env port (in production mode) or the port 8000 (in development mode)
const Port = process.env.PORT || 8000;
// get the database (configure the database)
const db = require("./config/mongoose");

// use express server
app = express();
const server = require("http").createServer(app);
// get the socket connection (configure socket)
const io = require("./config/socket")(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

// use encoded url
app.use(express.urlencoded({ extended: true }));
// use cors for cross origin requests
//app.use(cors());
// use json
app.use(express.json());

// in case of url/api get the routes index file and handle routes from there
app.use("/api", require("./routes/index"));

// run the server on the Port number specified
server.listen(Port, () => {
  console.log("Server is listening on port ", Port);
});
