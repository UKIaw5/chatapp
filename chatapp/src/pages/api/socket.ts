// pages/api/socket.ts

import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log("Starting Socket.io server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("message", (msg) => {
        console.log("Received message:", msg);
        io.emit("message", msg); // Broadcast message to all clients
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

