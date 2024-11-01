import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // adjust URL as needed

export default socket;

