// lib/mongodb.js

import { MongoClient } from "mongodb";

const uri = "mongodb://artisanalbaguette:6ShwDWr64l8E0l5v@localhost:27017"; // Update with your connection string
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;

