// src/pages/api/logout.js
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db("chatapp");
      const collection = db.collection("onlineUsers");

      const result = await collection.updateOne(
        { username },
        { $set: { status: "offline" } }
      );

      client.close();

      res.status(200).json({ message: "User logged out", result });
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

