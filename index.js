const express = require("express");
const cors = require("cors");
const Port = process.env.PORT || 8000;
const db = require("./config/mongoose");

app = express();
const server = require("http").createServer(app);
const io = require("./config/socket")(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/index"));

server.listen(Port);
