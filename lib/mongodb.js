const { MongoClient } = require('mongodb');

const uri = "mongodb://chatappuser:chatappuserpass@mongo:27017/chatapp?authSource=chatapp";
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
