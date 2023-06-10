import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";
import { ChatProps, SocketMensaje } from "../types/types";
import socket from "./Socket";

const OtroChat = ({ jugador }: ChatProps) => {
  const [mensajes, setMensajes] = useState<SocketMensaje[]>([]);
  const [mensaje, setMensaje] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("mensajes", (mensaje: SocketMensaje) => {
      setMensajes([...mensajes, mensaje]);
    });
    return () => {
      socket.off("mensajes");
    };
  }, []);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (mensaje.trim() === "") return;

    socket.emit("mensaje", jugador.nombre, mensaje);
    setMensaje("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  return (
    <Container>
      <Row>
        <Col className="col-12">
          <div
            ref={messagesContainerRef}
            style={{ height: "300px", overflowY: "scroll" }}
          >
            {mensajes.map((message, index) => (
              <p key={index}>
                <strong>{message.nombre}:</strong> {message.mensaje}
              </p>
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="col-9">
          <Form onSubmit={handleSendMessage}>
            <Form.Group controlId="messageInput">
              <Form.Control
                type="text"
                placeholder="Escribe un mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col className="col-3">
          <Button variant="primary" type="submit" onClick={handleSendMessage}>
            <Send className="mr-2" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OtroChat;
