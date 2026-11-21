import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/logging.middleware";
import strategyRoutes from "./routes/strategies";
import snipeRoutes from "./routes/snipes";
import userRoutes from "./routes/users";

const app = express();

// allow the Angular client (a different origin) to call this API
app.use(cors());
// parse JSON request bodies, then log every request
app.use(express.json());
app.use(requestLogger);

app.get("/", (_req, res) => {
  res.send("SniperLab API is running");
});

// all resources live under /api/v1
app.use("/api/v1/strategies", strategyRoutes);
app.use("/api/v1/snipes", snipeRoutes);
app.use("/api/v1/users", userRoutes);

export default app;
