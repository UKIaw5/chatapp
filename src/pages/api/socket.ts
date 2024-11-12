// /pages/api/socket.ts

import { Server } from "socket.io";
import clientPromise from "../../../lib/mongodb";

const users = new Set<string>();

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "http://localhost:3000",  // Replace with the actual client URL in production
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Handle user connection
      socket.on("user_connected", (username) => {
        socket.username = username;  // Attach username to the socket instance
        users.add(username);
        console.log("Emitting user list:", Array.from(users));  // Log current list of users
        io.emit("update_user_list", Array.from(users));  // Emit updated user list to all clients
      });

      // Handle incoming messages, save to MongoDB, and broadcast to all clients
      socket.on("message", async (messageData) => {
        try {
          const client = await clientPromise;
          const db = client.db("chatApp");
          const messagesCollection = db.collection("messages");
          await messagesCollection.insertOne(messageData);
          io.emit("message", messageData);  // Broadcast message to all clients
        } catch (error) {
          console.error("Failed to save message to MongoDB:", error);
        }
      });

      // Handle user disconnection and update the user list
      socket.on("disconnect", () => {
        if (socket.username) {
          users.delete(socket.username);
          console.log("User disconnected. Updated user list:", Array.from(users));  // Log updated list
          io.emit("update_user_list", Array.from(users));  // Emit updated user list
        }
      });
    });
  } else {
    console.log("Socket.io server already initialized");
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
