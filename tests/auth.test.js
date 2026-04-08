const request = require("supertest");
const app = require("../server");

const { sequelize, User } = require("../models");

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("POST /auth/register", () => {

  test("should register new user successfully", async () => {

    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "tester",
        email: "tester@test.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.user.email).toBe("tester@test.com");

  });

  test("should fail if email already exists", async () => {

    await User.create({
      username: "duplicate",
      email: "duplicate@test.com",
      password: "password123"
    });

    const response = await request(app)
      .post("/auth/register")
      .send({
        username: "duplicate2",
        email: "duplicate@test.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User already exists");

  });

});

describe("POST /auth/login", () => {

  beforeEach(async () => {
    await User.destroy({where: {}});

    await User.create({
      username: "loginUser",
      email: "login@test.com",
      password: "password123"
    });

  });

  test("should login successfully and return token", async () => {

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "login@test.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    token = response.body.token;

  });

  test("should fail with invalid password", async () => {

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "login@test.com",
        password: "wrongpassword"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");

  });

});

describe("GET /auth/me", () => {

  beforeAll(async () => {

    await User.create({
      username: "meUser",
      email: "me@test.com",
      password: "password123"
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: "me@test.com",
        password: "password123"
      });

    token = loginResponse.body.token;

  });

  test("should return current user when authenticated", async () => {

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("me@test.com");

  });

  test("should fail without token", async () => {

    const response = await request(app)
      .get("/auth/me");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Authentication token missing");

  });

  test("should fail with invalid token", async () => {

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");

  });

});