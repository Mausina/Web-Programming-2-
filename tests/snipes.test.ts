import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

let mongoServer: MongoMemoryServer;
let strategyId = "";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // a snipe needs a strategy, so create one first
  const res = await request(app).post("/api/v1/strategies").send({
    name: "Snipe Test Strategy",
    buyAmountSol: 0.5,
    takeProfitPct: 100,
    stopLossPct: 30,
    maxHoldMinutes: 15,
  });
  strategyId = res.body._id;
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const missingId = "64b7f0c2a1b2c3d4e5f60789";

describe("Snipes API", () => {
  let snipeId = "";

  function goodSnipe() {
    return {
      strategy: strategyId,
      tokenName: "Pepe Rocket",
      tokenMint: "MASi45ub7Qe4ZE36UT5G6cU4ud8Fhhe4deS4F3cw9KTA",
      amountSol: 0.5,
    };
  }

  it("POST with correct data creates a snipe", async () => {
    const res = await request(app).post("/api/v1/snipes").send(goodSnipe());
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("open");
    snipeId = res.body._id;
  });

  it("POST with bad data returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/snipes")
      .send({ strategy: "123", tokenName: "", tokenMint: "abc", amountSol: -1 });
    expect(res.status).toBe(400);
  });

  it("POST with a strategy that does not exist returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/snipes")
      .send({ ...goodSnipe(), strategy: missingId });
    expect(res.status).toBe(400);
  });

  it("GET returns all snipes with the strategy name", async () => {
    const res = await request(app).get("/api/v1/snipes");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].strategy.name).toBe("Snipe Test Strategy");
  });

  it("GET one returns the snipe", async () => {
    const res = await request(app).get(`/api/v1/snipes/${snipeId}`);
    expect(res.status).toBe(200);
  });

  it("GET one returns 404 if the snipe does not exist", async () => {
    const res = await request(app).get(`/api/v1/snipes/${missingId}`);
    expect(res.status).toBe(404);
  });

  it("PUT closes the snipe", async () => {
    const res = await request(app)
      .put(`/api/v1/snipes/${snipeId}`)
      .send({ ...goodSnipe(), status: "closed", profitLossPct: 50 });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("closed");
    expect(res.body.profitLossPct).toBe(50);
  });

  it("PUT returns 404 if the snipe does not exist", async () => {
    const res = await request(app).put(`/api/v1/snipes/${missingId}`).send(goodSnipe());
    expect(res.status).toBe(404);
  });

  it("PUT with bad data returns 400", async () => {
    const res = await request(app)
      .put(`/api/v1/snipes/${snipeId}`)
      .send({ ...goodSnipe(), status: "sold" });
    expect(res.status).toBe(400);
  });

  it("DELETE deletes the snipe", async () => {
    const res = await request(app).delete(`/api/v1/snipes/${snipeId}`);
    expect(res.status).toBe(200);
  });

  it("DELETE returns 404 if the snipe does not exist", async () => {
    const res = await request(app).delete(`/api/v1/snipes/${missingId}`);
    expect(res.status).toBe(404);
  });
});
