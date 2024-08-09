const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { PlayerJoined, Reset, PlayerLeaved, Playing } = require("./field");

// const { PlayerJoined, PlayerLeaved, Playing } = require("./xo");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT} `);
});

const io = socketIo(server, { cors: { origin: "*", methods: "*" } });

io.on("connection", (socket) => {
  Reset(io, socket);
  PlayerJoined(io, socket);
  Playing(io, socket);
  console.log("new user joined the server");
  //   PlayerJoined(io, socket);
  //   Playing(io, socket);

  socket.on("disconnect", () => {
    console.log("user leaved the server");
    PlayerLeaved(io, socket);
    // PlayerLeaved(io, socket);
  });
});
