// pages/api/socket.ts

import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

const users = new Set<string>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log("Starting Socket.io server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Handle user connection and add to user list
      socket.on("user_connected", (username: string) => {
        socket.username = username;
        users.add(username);
        io.emit("update_user_list", Array.from(users));
      });

      // Listen for "message" event from client
      socket.on("message", (msg) => {
        console.log("Server received message:", msg); // Debug log
        io.emit("message", msg); // Broadcast message to all clients
      });

      // Handle user disconnection
      socket.on("disconnect", () => {
        if (socket.username) {
          users.delete(socket.username);
          io.emit("update_user_list", Array.from(users));
        }
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
