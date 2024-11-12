// lib/mongodb.js
import { MongoClient } from "mongodb";

// Decide the URI based on USE_CLOUD_DB environment variable
const uri = process.env.USE_CLOUD_DB === "true"
  ? "mongodb+srv://username:password@cluster.mongodb.net/chatApp?retryWrites=true&w=majority"  // Cloud MongoDB URI
  : "mongodb://localhost:27017/chatApp";  // Local MongoDB URI

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
