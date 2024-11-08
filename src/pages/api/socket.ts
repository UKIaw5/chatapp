// pages/api/socket.ts

import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const users = new Set<string>();

import clientPromise from './lib/mongodb';

async function saveMessage(messageData) {
  const client = await clientPromise;
  const db = client.db("chatApp"); // Replace 'chatApp' with your database name if different
  const messagesCollection = db.collection("messages");
  
  return messagesCollection.insertOne({
    userId: messageData.userId,
    username: messageData.username,
    content: messageData.content,
    timestamp: new Date(),
  });
}

socket.on('sendMessage', async (messageData) => {
  const savedMessage = await saveMessage(messageData);
  io.emit('message', savedMessage); // Broadcast message to all clients
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("User connected:", socket.id);

      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("chatapp");

      // Load chat history on connection
      const messages = await db.collection("messages").find({}).toArray();
      socket.emit("chat_history", messages);

      socket.on('sendMessage', async (messageData) => {
        const message = new Message({
          userId: messageData.userId,
          username: messageData.username,
          content: messageData.content,
        });
        await message.save(); // Save to MongoDB
        io.emit('message', message); // Broadcast to all clients
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
      socket.on('join', async () => {
        const client = await clientPromise;
        const db = client.db("chatApp");
        const messagesCollection = db.collection("messages");
        const chatHistory = await Message.find().sort({ timestamp: -1 }).limit(50).exec();
        socket.emit('chatHistory', chatHistory.reverse()); // Send chat history to user
      });
      socket.on('join', async () => {
  const client = await clientPromise;
  const db = client.db("chatApp");
  const messagesCollection = db.collection("messages");

  const chatHistory = await messagesCollection.find().sort({ timestamp: -1 }).limit(50).toArray();
  socket.emit('chatHistory', chatHistory.reverse());
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
