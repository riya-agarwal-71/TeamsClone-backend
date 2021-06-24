module.exports = (server, options) => {
  const connections = {};
  const io = require("socket.io")(server, options);
  io.on("connection", (socket) => {
    socket.on("join-call", (url) => {
      if (connections[url] === undefined) {
        connections[url] = [];
      }
      connections[url].push(socket.id);

      connections[url].forEach((id, ind, arr) => {
        io.to(id).emit("user-joined", socket.id, arr);
      });
    });

    socket.on("add-ice", (toid, candidate) => {
      io.to(toid).emit("add-ice", socket.id, candidate);
    });

    socket.on("set-description", (toid, description) => {
      io.to(toid).emit("set-description", socket.id, description);
    });

    socket.on("disconnect", () => {
      let url;
      Object.entries(connections).forEach(([key, val]) => {
        val.forEach((id) => {
          if (id === socket.id) {
            url = key;
          }
        });
      });
      let ind = connections[url].indexOf(socket.id);
      connections[url].splice(ind, 1);
      for (let id of connections[url]) {
        io.to(id).emit("user-left", socket.id);
      }
      if (connections[url].length <= 0) {
        delete connections[url];
      }
    });
  });
};