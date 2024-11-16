const { MongoClient } = require('mongodb');

const uri = "mongodb://artisanalbaguette:6ShwDWr64l8E0l5v@mongo:27017/chatApp"; // Replace with your MongoDB URI
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);

  global._mongoClientPromise = client.connect().catch(err => {
    console.error("Failed to connect to MongoDB:", err.message);
    throw err; // Ensure promise rejection is propagated
  });
}

clientPromise = global._mongoClientPromise;

module.exports = clientPromise;
