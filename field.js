let players = { player1: null, player2: null };
let position = 0;
let step = 1;
let winner = null;

const Player1Click = () => {
  if (players.player1 !== null) {
    position += step;
  }
};

const Player2Click = () => {
  if (players.player2 !== null) {
    position += step;
  }
};

const VerifyWinner = () => {
  if (position > 100) {
    winner = players.player1;
  }
  if (position < -100) {
    winner = players.player2;
  }
};

const EmmitPosition = (io) => {
  io.to(players.player1).emit("position", position);
  io.to(players.player2).emit("position", position);
};

const Reset = (io, socket) => {
  socket.on("reset", () => {
    position = 0;
    winner = null;
    EmmitPosition(io);
  });
};

const PlayerLeaved = (io, socket) => {
  if (players.player1 === socket.id) {
    players.player1 = null;
  }
  if (players.player2 === socket.id) {
    players.player2 = null;
  }
};

const PlayerJoined = (io, socket) => {
  if (players.player1 === null) {
    players.player1 = socket.id;
    socket.emit("player", 1);
  } else if (players.player2 === null) {
    players.player2 = socket.id;
    socket.emit("player", 2);
  } else {
    socket.emit("player", -1);
  }
};

const Playing = (io, socket) => {
  socket.on("click", () => {
    let id = socket.id;
    if (id === players.player1) {
      position += step;
    }

    if (id === players.player2) {
      position -= step;
    }

    EmmitPosition(io);

    if (position >= 100) {
      winner = players.player1;
    }

    if (position <= -100) {
      winner = players.player2;
    }

    if (winner !== null) {
      io.to(players.player1).emit("winner", winner);
      io.to(players.player2).emit("winner", winner);
    }
  });
};

module.exports = {
  PlayerJoined,
  PlayerLeaved,
  Reset,
  Playing,
};
