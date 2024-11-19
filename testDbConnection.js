const { MongoClient } = require('mongodb');

const uri = "mongodb://chatappuser:chatappuserpass@mongo:27017/chatapp?authSource=chatapp";
const client = new MongoClient(uri);

(async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
    } finally {
        await client.close();
    }
})();
