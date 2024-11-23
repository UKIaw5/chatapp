import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

export default function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', async (socket) => {
            console.log('User connected:', socket.id);

            try {
                const client = await clientPromise;
                const db = client.db('chatApp');
                const onlineUsersCollection = db.collection('onlineUsers');

                // Handle user connection
                socket.on('setUserOnline', async (username) => {
                    await onlineUsersCollection.updateOne(
                        { username },
                        { $set: { status: 'online' } },
                        { upsert: true }
                    );
                    console.log(`${username} is now online`);
                });

                // Handle user disconnection
                socket.on('disconnect', async () => {
                    await onlineUsersCollection.updateOne(
                        { username: socket.id },
                        { $set: { status: 'offline' } }
                    );
                    console.log(`User ${socket.id} disconnected`);
                });
            } catch (error) {
                console.error('Error in socket handler:', error);
            }
        });
    }
    res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
