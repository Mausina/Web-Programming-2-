import mongoose from "mongoose";
import { env } from "./env";

// connect to MongoDB Atlas using the connection string from the environment
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoURI);
    console.log(`MongoDB Connected (Mongoose): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};
