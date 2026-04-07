const request = require("supertest");
const app = require("../server");

const db = require("../database/db");

const { User } = require("../models");
const { sequelize } = require("../models");

let token;
let otherUserToken;
let assignmentId;

beforeAll(async () => {

  await sequelize.sync({ force: true });


  /*
  =========================
  Create primary user
  =========================
  */

  await User.create({
    username: "tester",
    email: "tester@test.com",
    password: "password123"
  });

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: "tester@test.com",
      password: "password123"
    });

  token = loginResponse.body.token;


  /*
  =========================
  Create second user
  =========================
  */

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


  /*
  =========================
  Create course (owned)
  =========================
  */

  const courseResponse = await request(app)
    .post("/courses")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Biology"
    });


  /*
  =========================
  Create assignment (owned)
  =========================
  */

  const assignmentResponse = await request(app)
    .post("/assignments")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Lab Report",
      courseId: courseResponse.body.id
    });

  assignmentId = assignmentResponse.body.id;

});


afterAll(async () => {
  await db.close();
});


describe("POST /study-sessions", () => {

  test("should create study session successfully", async () => {

    const response = await request(app)
      .post("/study-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        assignmentId,
        startTime: new Date("2024-01-01T10:00:00Z"),
        endTime: new Date("2024-01-01T11:00:00Z")
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.durationMinutes).toBe(60);

  });


  test("should fail if assignmentId missing", async () => {

    const response = await request(app)
      .post("/study-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 45
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error)
      .toBe("assignmentId, startTime, and endTime are required");

  });


  test("should block session creation for another user's assignment", async () => {

    const response = await request(app)
      .post("/study-sessions")
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({
        assignmentId,
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 30
      });

    expect(response.statusCode).toBe(403);

  });


  test("should fail if assignmentId invalid", async () => {

    const response = await request(app)
      .post("/study-sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        assignmentId: 999,
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 30
      });

    expect(response.statusCode).toBe(403);

  });


  test("should fail without authentication", async () => {

    const response = await request(app)
      .post("/study-sessions")
      .send({
        assignmentId,
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 30
      });

    expect(response.statusCode).toBe(401);

  });

});