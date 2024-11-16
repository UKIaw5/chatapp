const clientPromise = require('./lib/mongodb.js'); // Adjusted for CommonJS

async function testDbConnection() {
  try {
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully!');
    await client.close(); // Gracefully close the connection after testing
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

testDbConnection();
