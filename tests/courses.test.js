const request = require("supertest");
const app = require("../server");

const db = require("../database/db");

const { User } = require("../models");
const { sequelize } = require("../models");

let token;
let otherUserToken;

beforeAll(async () => {

  await sequelize.sync({ force: true });

  // Create primary test user
  await User.create({
    username: "tester",
    email: "tester@test.com",
    password: "password123"
  });

  // Login primary user
  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: "tester@test.com",
      password: "password123"
    });

  token = loginResponse.body.token;


  // Create second user (ownership testing)
  await User.create({
    username: "intruder",
    email: "intruder@test.com",
    password: "password123"
  });

  const intruderLogin = await request(app)
    .post("/auth/login")
    .send({
      email: "intruder@test.com",
      password: "password123"
    });

  otherUserToken = intruderLogin.body.token;

});


afterAll(async () => {
  await db.close();
});


describe("POST /courses", () => {

  test("should create a course successfully", async () => {

    const response = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Calculus II"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Calculus II");

  });


  test("should fail if course name missing", async () => {

    const response = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Course name is required");

  });


  test("should fail without authentication", async () => {

    const response = await request(app)
      .post("/courses")
      .send({
        name: "Unauthorized Course"
      });

    expect(response.statusCode).toBe(401);

  });

});


describe("GET /courses/:id", () => {

  test("should return a course by id (owner access)", async () => {

    const course = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Physics" });

    const response = await request(app)
      .get(`/courses/${course.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Physics");

  });


  test("should block access from another user", async () => {

    const course = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Private Course" });

    const response = await request(app)
      .get(`/courses/${course.body.id}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(response.statusCode).toBe(403);

  });


  test("should return 404 if course not found", async () => {

    const response = await request(app)
      .get("/courses/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);

  });


  test("should fail without authentication", async () => {

    const response = await request(app)
      .get("/courses/1");

    expect(response.statusCode).toBe(401);

  });

});