const request = require("supertest");
const app = require("../server");

const db = require("../database/db");

const { User } = require("../models");
const { sequelize } = require("../models");

let token;
let otherUserToken;
let courseId;

beforeAll(async () => {

  await sequelize.sync({ force: true });


  /*
  =========================
  Create primary test user
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
  Create course owned by tester
  =========================
  */

  const courseResponse = await request(app)
    .post("/courses")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Computer Science"
    });

  courseId = courseResponse.body.id;

});


afterAll(async () => {
  await db.close();
});


describe("POST /assignments", () => {

  test("should create assignment successfully", async () => {

    const response = await request(app)
      .post("/assignments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Project 1",
        courseId
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Project 1");

  });


  test("should fail if title missing", async () => {

    const response = await request(app)
      .post("/assignments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseId
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Title and courseId are required");

  });


  test("should fail if courseId invalid", async () => {

    const response = await request(app)
      .post("/assignments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Homework",
        courseId: 999
      });

    expect(response.statusCode).toBe(403);

  });


  test("should block assignment creation for another user's course", async () => {

    const response = await request(app)
      .post("/assignments")
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({
        title: "Hack Attempt",
        courseId
      });

    expect(response.statusCode).toBe(403);

  });


  test("should fail without authentication", async () => {

    const response = await request(app)
      .post("/assignments")
      .send({
        title: "Unauthorized Assignment",
        courseId
      });

    expect(response.statusCode).toBe(401);

  });

});