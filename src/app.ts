import express from "express";
import strategyRoutes from "./routes/strategies";
import snipeRoutes from "./routes/snipes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("SniperLab API is running");
});

app.use("/api/strategies", strategyRoutes);
app.use("/api/snipes", snipeRoutes);

export default app;
