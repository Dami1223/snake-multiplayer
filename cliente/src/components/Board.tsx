import React, { useEffect, useState } from "react";
import Snake from "./Snake";
import Food from "./Food";
import { allDots, getRandomCoordinates } from "../utils/utils";
import {
  AxisEnum,
  BoardProps,
  DirectionEnum,
  Dot,
  SnakeType,
} from "../types/types";
import socket from "./Socket";
import { Container } from "react-bootstrap";

function Board(props: BoardProps) {
  const TAMAÑO_DOTS = 4;
  const [snakeDots, setSnakeDots] = useState<SnakeType>([
    ...props.jugador.dots,
  ]);
  const [food, setFood] = useState<Dot>(
    getRandomCoordinates(allDots(props.jugadores))
  );
  const [foods, setFoods] = useState<Array<Dot>>([food]);
  const [direction, setDirection] = useState<DirectionEnum>("");
  const [speed, setSpeed] = useState<number>(100);
  const [axis, setAxis] = useState<AxisEnum>("");

  useEffect(() => {
    document.onkeydown = onKeyDown;
    checkIfOutOfBorders();
    checkIfCollapsed();
    checkIfCollapsedAnotherPlayer();
    const id = setInterval(() => moveSnake(), speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeDots, direction]);

  useEffect(() => {
    socket.emit("food", food);
  }, [food]);

  useEffect(() => {
    socket.on("foods", (foods: Array<Dot>) => {
      setFoods(foods);
    });
  }, [foods]);

  const onKeyDown = (event: KeyboardEvent) => {
    event = event || window.event;
    switch (event.key) {
      case "ArrowUp":
        if (axis !== "Y") {
          setDirection("UP");
          setAxis("Y");
        }
        break;
      case "ArrowDown":
        if (axis !== "Y") {
          setDirection("DOWN");
          setAxis("Y");
        }
        break;
      case "ArrowLeft":
        if (axis !== "X") {
          setDirection("LEFT");
          setAxis("X");
        }
        break;
      case "ArrowRight":
        if (axis !== "X") {
          setDirection("RIGHT");
          setAxis("X");
        }
        break;
      default:
    }
  };

  const moveSnake = () => {
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];
    switch (direction) {
      case "RIGHT":
        head = [head[0] + TAMAÑO_DOTS, head[1]];
        break;
      case "LEFT":
        head = [head[0] - TAMAÑO_DOTS, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + TAMAÑO_DOTS];
        break;
      case "UP":
        head = [head[0], head[1] - TAMAÑO_DOTS];
        break;
      default:
    }
    if (direction) {
      dots.push(head);
      if (!checkIfEat()) {
        dots.shift();
      }
      setSnakeDots(dots);
      socket.emit("move", dots);
    }
  };

  const checkIfOutOfBorders = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver();
    }
  };

  const checkIfCollapsed = () => {
    let snake = [...snakeDots];
    let head = snakeDots[snakeDots.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver();
      }
    });
  };

  const checkIfCollapsedAnotherPlayer = () => {
    props.jugadores.forEach((otro) => {
      if (otro.id !== props.jugador.id) {
        let snake = [...otro.dots];
        let head = snakeDots[snakeDots.length - 1];
        snake.forEach((dot) => {
          if (head[0] === dot[0] && head[1] === dot[1]) {
            onGameOver();
          }
        });
      }
    });
  };

  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1];
    let isEat = false;
    foods.forEach((food) => {
      if (head[0] === food[0] && head[1] === food[1]) {
        socket.emit("eatFood", food);
        setFood(getRandomCoordinates(allDots(props.jugadores)));
        // increaceSpeed();
        props.addScore();
        isEat = true;
      }
    });
    return isEat;
  };

  const increaceSpeed = () => {
    if (speed > 30) {
      setSpeed(speed - 5);
    }
  };

  const onGameOver = () => {
    const nuevaCoordenada = [getRandomCoordinates(allDots(props.jugadores))];
    setSnakeDots(nuevaCoordenada);
    socket.emit("move", nuevaCoordenada);
    setDirection("");
    setAxis("");
    // setSpeed(200);
  };

  return (
    <Container className="container">
      <div className="game-area">
        {props.jugadores.map((jugador) => (
          <Snake
            key={jugador.id}
            color={jugador.color}
            snakeDots={jugador.dots}
          />
        ))}
        {foods.map((food, i) => (
          <Food key={i + socket.id} dot={food} />
        ))}
      </div>
    </Container>
  );
}

export default Board;
