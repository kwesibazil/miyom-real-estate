import mongoose from 'mongoose';
import { ConnectError, ConfigureError } from '../errors/errors.error'; // Assuming you have custom error classes
import { MongoClient } from 'mongodb';



if (!process.env.MONGO_URL) {
  throw new ConfigureError('Database connection string environment variable (MONGO_URL) is missing.');
}





mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Mongoose database connected'))
  .catch(err => {
    console.error('Mongoose connection error:', err)
    throw new ConnectError()
  });




const mongoClientPromise = new MongoClient(process.env.MONGO_URL).connect()
  .then(client => {
    console.log('MongoDB client connected for session store');
    return client;
  })
  .catch(err => {
    console.error('Error connecting MongoDB client for session store:', err);
    throw new ConnectError()
  });


export { mongoClientPromise };
export default mongoose.connection; 