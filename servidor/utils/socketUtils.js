const socketIO = require("socket.io");
let jugadores = [];
let foods = [];
let jugando = false;
const PUNTOS_PARA_GANAR = 50;

exports.sio = (server) => {
  return socketIO(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
};

exports.connection = (io) => {
  io.on("connection", (socket) => {
    console.log("A user is connected");

    socket.on('conectado', (jugador) => {
      socket.broadcast.emit('mensajes', { nombre: jugador.nombre, mensaje: `Se conecto ${jugador.nombre}` });
      jugadores.push({
        nombre: jugador.nombre,
        color: jugador.color,
        puntos: 1,
        id: socket.id,
        dots: jugador.dots
      });
      io.emit('jugando', jugando);
      io.emit('jugadores', jugadores);
    });

    socket.on('mensaje', (nombre, mensaje) => {
      io.emit('mensajes', { nombre, mensaje });
    });

    socket.on("disconnect", () => {
      console.log(`socket ${socket.id} disconnected`);
      jugadores = jugadores.filter((jugador) => jugador.id !== socket.id);
      foods.shift();
      io.emit('foods', foods);
      io.emit('jugadores', jugadores);
    });

    socket.on("move", (dots) => {
      jugadores.map((jugador) => {
        if (jugador.id == socket.id) {
          jugador.dots = [...dots];
        }
        return jugador;
      });
      io.emit('jugadores', jugadores);
    });

    socket.on("addScore", puntos => {
      let gameOver = false;
      jugadores.map((jugador) => {
        if (jugador.id == socket.id) {
          jugador.puntos = puntos + 1;
          gameOver = jugador.puntos === PUNTOS_PARA_GANAR;
        }
        return jugador;
      });
      if (gameOver) {
        jugando = false;
        io.emit('jugando', jugando);
        io.emit('gameOver');
      }
      io.emit('jugadores', jugadores);
    });

    socket.on('food', (food) => {
      foods.push(food);
      io.emit('foods', foods);
    });

    socket.on("eatFood", (eatFood) => {
      foods = foods.filter((food) => food[0] !== eatFood[0] || food[1] !== eatFood[1]);
      io.emit('foods', foods);
    });

    socket.on("restartGame", () => {
      jugadores.map((jugador) => {
        jugador.puntos = 1;
        jugador.dots = [];
        return jugador;
      });
      foods = []
      jugando = true;
      io.emit('jugando', jugando);
      io.emit('foods', foods);
      io.emit('jugadores', jugadores);
      io.emit('restartGameAll');
    });

    socket.on('estoyListo', () => {
      jugadores = jugadores.map((jugador) => jugador.estado = true);
      io.emit('jugadores', jugadores);
    });

    socket.on('comenzar', () => {
      jugando = true;
      io.emit('jugando', jugando);
    })

  });
};
