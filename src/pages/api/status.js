// src/pages/api/status.js
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db("chatapp");
      const collection = db.collection("onlineUsers");

      const users = await collection.find({}).toArray();

      client.close();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

