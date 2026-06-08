// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
	throw new Error('MONGODB_URI is not defined in .env.local');
}

// use global var to prevent multiple connections in dev (hot reload creates new connections)
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<mongoose.Connection> {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => {
      console.log("Connected to MongoDB");
      return m.connection;
    }).catch((err) => {
      console.error("Error connecting to MongoDB", err);
      throw err;
    });
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default connectDB;
