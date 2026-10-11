import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

// the tests use a database in memory so they don't change the real data
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const goodStrategy = {
  name: "Test Strategy",
  buyAmountSol: 0.5,
  takeProfitPct: 100,
  stopLossPct: 30,
  maxHoldMinutes: 15,
};

// an id that is valid but not in the database
const missingId = "64b7f0c2a1b2c3d4e5f60789";

describe("Strategies API", () => {
  let strategyId = "";

  it("POST with correct data creates a strategy", async () => {
    const res = await request(app).post("/api/strategies").send(goodStrategy);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Strategy");
    expect(res.body.isActive).toBe(true);
    strategyId = res.body._id;
  });

  it("POST with bad data returns 400", async () => {
    const res = await request(app)
      .post("/api/strategies")
      .send({ name: "ab", buyAmountSol: 0, takeProfitPct: 100, stopLossPct: 150, maxHoldMinutes: 15 });
    expect(res.status).toBe(400);
  });

  it("GET returns all strategies", async () => {
    const res = await request(app).get("/api/strategies");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("GET one returns the strategy", async () => {
    const res = await request(app).get(`/api/strategies/${strategyId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(strategyId);
  });

  it("GET one returns 404 if the strategy does not exist", async () => {
    const res = await request(app).get(`/api/strategies/${missingId}`);
    expect(res.status).toBe(404);
  });

  it("GET one returns 400 for an invalid id", async () => {
    const res = await request(app).get("/api/strategies/abc");
    expect(res.status).toBe(400);
  });

  it("PUT updates the strategy", async () => {
    const res = await request(app)
      .put(`/api/strategies/${strategyId}`)
      .send({ ...goodStrategy, name: "New Name" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("New Name");
  });

  it("PUT returns 404 if the strategy does not exist", async () => {
    const res = await request(app).put(`/api/strategies/${missingId}`).send(goodStrategy);
    expect(res.status).toBe(404);
  });

  it("PUT with bad data returns 400", async () => {
    const res = await request(app)
      .put(`/api/strategies/${strategyId}`)
      .send({ ...goodStrategy, maxHoldMinutes: 0 });
    expect(res.status).toBe(400);
  });

  it("DELETE deletes the strategy", async () => {
    const res = await request(app).delete(`/api/strategies/${strategyId}`);
    expect(res.status).toBe(200);

    const check = await request(app).get(`/api/strategies/${strategyId}`);
    expect(check.status).toBe(404);
  });

  it("DELETE returns 404 if the strategy does not exist", async () => {
    const res = await request(app).delete(`/api/strategies/${missingId}`);
    expect(res.status).toBe(404);
  });
});
