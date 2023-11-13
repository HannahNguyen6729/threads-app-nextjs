import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL as string;

export const connectDatabase = () => {
  mongoose.connect(MONGODB_URL);

  mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection is open to MongoDB Atlas');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected');
  });
};
