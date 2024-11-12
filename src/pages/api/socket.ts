// /pages/api/socket.ts

import { Server } from "socket.io";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("user_connected", async (username) => {
        socket.username = username;

        const client = await clientPromise;
        const db = client.db("chatApp");
        const onlineUsersCollection = db.collection("onlineUsers");

        // Set the user as online in the database
        await onlineUsersCollection.updateOne(
          { username },
          { $set: { status: "online" } },
          { upsert: true }
        );

        // Emit the updated list of online users
        const onlineUsers = await onlineUsersCollection.find({ status: "online" }).toArray();
        io.emit("update_user_list", onlineUsers.map(user => user.username));
      });

      socket.on("user_disconnected", async (username) => {
        const client = await clientPromise;
        const db = client.db("chatApp");
        const onlineUsersCollection = db.collection("onlineUsers");

        // Set the user as offline in the database
        await onlineUsersCollection.updateOne(
          { username },
          { $set: { status: "offline" } }
        );

        // Emit the updated list of online users
        const onlineUsers = await onlineUsersCollection.find({ status: "online" }).toArray();
        io.emit("update_user_list", onlineUsers.map(user => user.username));
      });

      socket.on("disconnect", async () => {
        if (socket.username) {
          const client = await clientPromise;
          const db = client.db("chatApp");
          const onlineUsersCollection = db.collection("onlineUsers");

          // Set the user as offline in the database on disconnect
          await onlineUsersCollection.updateOne(
            { username: socket.username },
            { $set: { status: "offline" } }
          );

          // Emit the updated list of online users
          const onlineUsers = await onlineUsersCollection.find({ status: "online" }).toArray();
          io.emit("update_user_list", onlineUsers.map(user => user.username));
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
