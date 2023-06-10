import { io, Socket } from "socket.io-client";

let socket: Socket = io("ws://localhost:4000");

export default socket;
