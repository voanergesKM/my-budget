import mongoose from "mongoose";
import { DatabaseError } from "@/app/lib/errors/customErrors";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        const connection = await mongoose.connect(MONGODB_URI);
        return connection;
      } catch (err) {
        console.error("MongoDB connection error:", err);
        throw new DatabaseError("Failed to connect to the database");
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null; 
    throw err;
  }
}

export default dbConnect;
