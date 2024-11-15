import { MongoClient } from "mongodb";

// Use the MongoDB URI from the environment variable
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chatApp";
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
