// pages/api/socket.ts

import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

// Initialize users set
const users = new Set<string>();

// Function to save a message to MongoDB
async function saveMessage(messageData: { userId: any; username: any; content: any; }) {
  const client = await clientPromise;
  const db = client.db("chatApp");
  const messagesCollection = db.collection("messages");

  const result = await messagesCollection.insertOne({
    userId: messageData.userId,
    username: messageData.username,
    content: messageData.content,
    timestamp: new Date(),
  });
  
  return result.insertedId
    ? { _id: result.insertedId, ...messageData, timestamp: new Date() }
    : null;
}

// Main handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("User connected:", socket.id);

      // Load and send chat history upon connection
      const client = await clientPromise;
      const db = client.db("chatApp");
      const messagesCollection = db.collection("messages");
      const messages = await messagesCollection.find({}).sort({ timestamp: -1 }).limit(50).toArray();
      socket.emit("chatHistory", messages.reverse());

      // Listen for 'sendMessage' events
      socket.on('sendMessage', async (messageData) => {
        const savedMessage = await saveMessage(messageData);
        if (savedMessage) {
          io.emit('message', savedMessage); // Emit message to all clients
        }
      });
     
      // Handle user disconnection
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  res.end();
}

// Disable body parsing for WebSocket connections
export const config = {
  api: {
    bodyParser: false,
  },
};
