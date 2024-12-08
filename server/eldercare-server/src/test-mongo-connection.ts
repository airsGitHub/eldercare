import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('Attempting to connect with URI:', uri);
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    // Test database access
    const db = client.db('eldercare');
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

testConnection();
