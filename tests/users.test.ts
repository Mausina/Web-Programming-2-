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

const goodUser = {
  username: "sniper_joe",
  email: "joe@example.com",
  password: "secret123",
};

// an id that is valid but not in the database
const missingId = "64b7f0c2a1b2c3d4e5f60789";

describe("Users API", () => {
  let userId = "";

  it("POST registers a user and never returns the password hash", async () => {
    const res = await request(app).post("/api/v1/users").send(goodUser);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe("sniper_joe");
    expect(res.body.email).toBe("joe@example.com");
    expect(res.body.passwordHash).toBeUndefined();
    expect(res.body.password).toBeUndefined();
    userId = res.body._id;
  });

  it("POST with bad data returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ username: "ab", email: "not-an-email", password: "123" });
    expect(res.status).toBe(400);
  });

  it("POST with a duplicate email returns 409", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ ...goodUser, username: "another_name" });
    expect(res.status).toBe(409);
  });

  it("GET returns all users without the password hash", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].passwordHash).toBeUndefined();
  });

  it("GET one returns the user", async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(userId);
  });

  it("GET one returns 404 if the user does not exist", async () => {
    const res = await request(app).get(`/api/v1/users/${missingId}`);
    expect(res.status).toBe(404);
  });

  it("GET one returns 400 for an invalid id", async () => {
    const res = await request(app).get("/api/v1/users/abc");
    expect(res.status).toBe(400);
  });

  it("POST login succeeds with the correct password", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({ email: goodUser.email, password: goodUser.password });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(goodUser.email);
  });

  it("POST login fails with the wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({ email: goodUser.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("DELETE deletes the user", async () => {
    const res = await request(app).delete(`/api/v1/users/${userId}`);
    expect(res.status).toBe(200);

    const check = await request(app).get(`/api/v1/users/${userId}`);
    expect(check.status).toBe(404);
  });

  it("DELETE returns 404 if the user does not exist", async () => {
    const res = await request(app).delete(`/api/v1/users/${missingId}`);
    expect(res.status).toBe(404);
  });
});
