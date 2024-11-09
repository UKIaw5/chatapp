// /pages/api/socket.ts

import { Server } from "socket.io";
import clientPromise from "../../../lib/mongodb";  // MongoDB connection setup

const users = new Set<string>();

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "http://localhost:3000",  // Replace with client’s specific origin in production
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Handle user connection
      socket.on("user_connected", (username) => {
        socket.username = username;
        users.add(username);  // Add user to set
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
          users.delete(socket.username);  // Remove user from set
          io.emit("update_user_list", Array.from(users));  // Broadcast updated user list
        }
        console.log("User disconnected:", socket.id);
      });

      // Optional: Handle explicit logout
      socket.on("user_disconnected", (username) => {
        users.delete(username);  // Remove user from set
        io.emit("update_user_list", Array.from(users));  // Emit updated user list
      });
    });
  } else {
    console.log("Socket.io server already initialized");
  }

  res.end();
}

// Next.js API config to disable body parsing for WebSocket communication
export const config = {
  api: {
    bodyParser: false,
  },
};
