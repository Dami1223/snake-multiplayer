import React, { useEffect, useState } from "react";
import Board from "./Board";
import Chat from "./Chat";
import Form from "./Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { Jugador } from "../types/types";
import TablaJugadores from "./TablaJugadores";
import socket from "./Socket";
import { Button, Col, Container, Row } from "react-bootstrap";
import { getRandomCoordinates, ordenarJugadores } from "../utils/utils";

const App = () => {
  const [registrado, setRegistrado] = useState<boolean>(false);
  const [jugador, setJugador] = useState<Jugador>({
    nombre: "",
    color: "red",
    puntos: 1,
    dots: [getRandomCoordinates()],
  });
  const [jugadores, setJugadores] = useState<Array<Jugador>>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [comenzar, setComenzar] = useState<boolean>(false);

  const registrar = (e: any) => {
    e.preventDefault();
    if (jugador.nombre !== "") {
      socket.emit("conectado", jugador);
      setJugador({ ...jugador, id: socket.id });
      setRegistrado(true);
    }
  };
  useEffect(() => {
    socket.on("connnection", () => {
      console.log("connected to server");
    });
    socket.on("jugadores", (jugadores: Array<Jugador>) => {
      setJugadores(jugadores);
    });
    socket.on("jugando", (jugando) => setComenzar(jugando));
    socket.on("restartGameAll", () => {
      setGameOver(false);
      const nuevasCoordenadas = getRandomCoordinates();
      setJugador({ ...jugador, puntos: 1, dots: [nuevasCoordenadas] });
      socket.emit("move", [nuevasCoordenadas]);
    });
    socket.on("gameOver", () => {
      setGameOver(true);
      const nuevasCoordenadas = getRandomCoordinates();
      setJugador({ ...jugador, puntos: 1, dots: [nuevasCoordenadas] });
      socket.emit("move", [nuevasCoordenadas]);
    });
    return () => {
      socket.off("connnection");
      socket.off("jugadores");
      socket.off("jugando");
      socket.off("restartGameAll");
      socket.off("gameOver");
    };
  }, []);

  const addScore = () => {
    socket.emit("addScore", jugador.puntos);
    setJugador({ ...jugador, puntos: jugador.puntos + 1 });
  };

  const restartGame = () => {
    socket.emit("restartGame");
  };

  return (
    <>
      {!gameOver && (
        <Container fluid>
          <Row>
            {!registrado && (
              <Form
                onSubmit={registrar}
                jugador={jugador}
                setJugador={setJugador}
              />
            )}
            {registrado && (
              <>
                <Col xs lg="4">
                  <TablaJugadores jugadores={jugadores} />
                  <Row>
                    <Chat jugador={jugador} />
                  </Row>
                  {jugador.id === jugadores.at(0)?.id && !comenzar ? (
                    <Button onClick={() => socket.emit("comenzar")}>
                      Comenzar
                    </Button>
                  ) : null}
                </Col>
                {comenzar && (
                  <Col>
                    <Board
                      addScore={addScore}
                      jugador={jugador}
                      jugadores={jugadores}
                    />
                  </Col>
                )}
              </>
            )}
          </Row>
        </Container>
      )}
      {gameOver && (
        <Container fluid>
          <Row>
            <h3>{`El ganador es ${
              ordenarJugadores(jugadores).at(0)?.nombre
            }`}</h3>
          </Row>
          <Row>
            <TablaJugadores jugadores={jugadores} />
          </Row>
          <Row>
            {jugador.id === jugadores.at(0)?.id ? (
              <Button onClick={restartGame}>Volver a jugar</Button>
            ) : null}
          </Row>
        </Container>
      )}
    </>
  );
};

export default App;
