import { connectDB } from "./config/database";
import { env } from "./config/env";
import app from "./app";

// connect to the database first, then start listening
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
