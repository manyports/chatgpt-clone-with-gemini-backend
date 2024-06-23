import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = 3000;
const mongoUri = process.env.MONGO_URI;

const corsOptions = {
  origin: 'http://localhost:5173',
};

app.use(cors(corsOptions)); 
app.use(express.json());

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MONGODB');
    const db = client.db('chatDB');
    const chatsCollection = db.collection('chats');

    app.post('/saveChat', async (req, res) => {
      const chatData = req.body;
      try {
        await chatsCollection.insertOne(chatData);
        res.status(200).send('Chat saved successfully');
      } catch (error) {
        console.error('Error saving chat:', error);
        res.status(500).send('Error saving chat');
      }
    });

    app.get('/getChats', async (req, res) => {
      try {
        const chats = await chatsCollection.find().toArray();
        res.status(200).json(chats);
      } catch (error) {
        console.error('Error retrieving chats:', error);
        res.status(500).send('Error retrieving chats');
      }
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => console.error(error));
