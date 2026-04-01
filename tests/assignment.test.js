const request = require("supertest");
const app = require("../server");

const db = require("../database/db");
const Course = require("../models/Course");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll(async () => {
  await db.close();
});

describe("POST /assignments", () => {

  test("should create assignment successfully", async () => {

    // First create a course (required foreign key)
    const course = await Course.create({
      name: "Computer Science"
    });

    const response = await request(app)
      .post("/assignments")
      .send({
        title: "Project 1",
        courseId: course.id
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Project 1");

  });


  test("should fail if title missing", async () => {

    const response = await request(app)
      .post("/assignments")
      .send({
        courseId: 1
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Tittle and courseId are required");

  });


  test("should fail if courseId invalid", async () => {

    const response = await request(app)
      .post("/assignments")
      .send({
        title: "Homework",
        courseId: 999
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid courseId");

  });

});