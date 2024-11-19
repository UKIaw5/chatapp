import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const client = await MongoClient.connect(process.env.MONGODB_URI);
            const db = client.db('chatapp');
            const data = await db.collection('testCollection').find({}).toArray();
            client.close();

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Failed to connect to database', error });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
