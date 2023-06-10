import express from 'express';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: '*' } });
let jugadores = [];
let foods = [];
let jugando = false;
const PUNTOS_PARA_GANAR = 50;
io.on('connection', async (socket) => {
    console.log(`Se conecto ${socket.id}`);
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

app.use(cors());

server.listen(port);

console.log(`New Server started on port ${port}`);