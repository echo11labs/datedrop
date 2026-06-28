import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  const MONGODB_URL = process.env.MONGODB_URL;

  if (!MONGODB_URL || !MONGODB_URL.startsWith("mongodb")) {
    throw new Error(
      "MONGODB_URL is not set or invalid. Add it to your .env file.\n" +
        "Example: MONGODB_URL=mongodb://localhost:27017/datedrop",
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
