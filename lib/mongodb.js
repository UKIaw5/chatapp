const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://chatappuser:chatappuserpass@mongo:27017/chatapp?authSource=chatapp';
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

module.exports = { connect, client };
