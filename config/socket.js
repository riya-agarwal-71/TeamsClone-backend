module.exports = (server, options) => {
  const utils = require("../helper/utils");
  const connections = {};
  const usernames = {};
  const io = require("socket.io")(server, options);
  io.on("connection", (socket) => {
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

    socket.on("send-message-group", (grpID) => {
      io.emit("message-recieved-group", grpID);
    });

    socket.on("screen-share", (url) => {
      connections[url].forEach((id) => {
        io.to(id).emit("screen-share", socket.id);
      });
    });

    socket.on("add-participant-group", (email, grpID) => {
      io.emit("participant-add-grp", email, grpID);
    });

    socket.on("remove-participant-group", (to, grpID) => {
      io.emit("remove-participant-group", to, grpID);
    });

    socket.on("end-screen-share", (url) => {
      connections[url].forEach((id) => {
        io.to(id).emit("end-screen-share");
      });
    });

    socket.on("add-ice", (toid, candidate) => {
      io.to(toid).emit("add-ice", socket.id, candidate);
    });

    socket.on("set-description", (toid, description) => {
      io.to(toid).emit("set-description", socket.id, description);
    });

    socket.on("message", (message, location, username, fromid) => {
      connections[location].forEach((id) => {
        io.to(id).emit("message", message, username, fromid);
      });
    });

    socket.on("disconnect", () => {
      let url = null;
      Object.entries(connections).forEach(([key, val]) => {
        val.forEach((id) => {
          if (id === socket.id) {
            url = key;
          }
        });
      });
      if (url === null) {
        return;
      }
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
