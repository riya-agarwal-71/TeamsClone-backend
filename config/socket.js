// connect to the socket on the server
module.exports = (server, options) => {
  const utils = require("../helper/utils");
  const connections = {}; // the array of all the meets in prgress along with the participants
  const usernames = {}; // the collection of the socketids along with the usernames
  const io = require("socket.io")(server, options);
  io.on("connection", (socket) => {
    // event when a new user joins a video call
    socket.on("join-call", (url, username) => {
      if (connections[url] === undefined) {
        connections[url] = [];
        usernames[url] = [];
      }
      var socketID = socket.id;
      connections[url].push(socketID);
      usernames[url].push(username);

      connections[url].forEach((id, ind, arr) => {
        io.to(id).emit("user-joined", socket.id, usernames[url], arr);
      });
    });

    // event that sends a message in the group
    socket.on("send-message-group", (grpID, msg) => {
      io.emit("message-recieved-group", grpID, msg);
    });

    // event when a participant turns on screen share
    socket.on("screen-share", (url) => {
      connections[url].forEach((id) => {
        io.to(id).emit("screen-share", socket.id);
      });
    });

    // event when a member id added to the group
    socket.on("add-participant-group", (email, grpID) => {
      io.emit("participant-add-grp", email, grpID);
    });

    // event when a member is removed from the group
    socket.on("remove-participant-group", (to, grpID) => {
      io.emit("remove-participant-group", to, grpID);
    });

    // event when participants end the screen share
    socket.on("end-screen-share", (url) => {
      connections[url].forEach((id) => {
        io.to(id).emit("end-screen-share");
      });
    });

    // event to add the ice candidate
    socket.on("add-ice", (toid, candidate) => {
      io.to(toid).emit("add-ice", socket.id, candidate);
    });

    // event to set the description of the peer connection
    socket.on("set-description", (toid, description) => {
      io.to(toid).emit("set-description", socket.id, description);
    });

    // event to send the message in the video call chat
    socket.on("message", (message, location, username, fromid) => {
      connections[location].forEach((id) => {
        io.to(id).emit("message", message, username, fromid);
      });
    });

    // event when the socket diosconnects
    socket.on("disconnect", () => {
      let url = null;
      Object.entries(connections).forEach(([key, val]) => {
        val.forEach((id) => {
          if (id === socket.id) {
            url = key;
          }
        });
      });
      // if its a group socket then skip the deletion of memeber from url
      if (url === null) {
        return;
      }
      // delete the participant (socketid) from the connections object
      let ind = connections[url].indexOf(socket.id);
      connections[url].splice(ind, 1);
      usernames[url].splice(ind, 1);
      for (let id of connections[url]) {
        io.to(id).emit("user-left", socket.id);
      }
      if (connections[url].length <= 0) {
        let code = url.split("/");
        code = code[code.length - 1];
        utils.deleteRoomID(code);
        delete connections[url];
        delete usernames[url];
      }
    });
  });
};
