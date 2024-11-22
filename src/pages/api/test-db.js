import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Ensure this is set in .env
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('chatapp');
    const collection = db.collection('onlineUsers');

    // Insert
    const insertResult = await collection.insertOne({ username: 'testUser', status: 'online' });

    // Update
    const updateResult = await collection.updateOne(
      { username: 'testUser' },
      { $set: { status: 'offline' } }
    );

    // Delete
    const deleteResult = await collection.deleteOne({ username: 'testUser' });

    // Return all results
    res.status(200).json({
      message: 'Database operations successful!',
      insertResult,
      updateResult,
      deleteResult,
    });
  } catch (error) {
    res.status(500).json({ message: 'Database operation failed', error });
  } finally {
    await client.close();
  }
}

