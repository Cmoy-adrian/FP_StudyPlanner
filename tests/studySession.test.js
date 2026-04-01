const request = require("supertest");
const app = require("../server");
const { db, Course, Assignment } = require("../models");

beforeEach(async () => {
  await db.sync({ force: true });
});

describe("POST /study-sessions", () => {

  test("should create study session successfully", async () => {

    // Create required course
    const course = await Course.create({
      name: "Biology"
    });

    // Create required assignment
    const assignment = await Assignment.create({
      title: "Lab Report",
      courseId: course.id
    });

    const response = await request(app)
      .post("/study-sessions")
      .send({
        assignmentId: assignment.id,
        startTime: new Date(),
        endTime: new Date(),
        durationMinutes: 60
       })

    expect(response.statusCode).toBe(201);
    expect(response.body.durationMinutes).toBe(60);

  });


  test("should fail if assignmentId missing", async () => {

    const response = await request(app)
      .post("/study-sessions")
      .send({
        duration: 45
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error)
      .toBe("assignmentId and duration are required");

  });


  test("should fail if assignmentId invalid", async () => {

    const response = await request(app)
      .post("/study-sessions")
      .send({
        assignmentId: 999,
        duration: 30
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error)
      .toBe("Invalid assignmentId");

  });

});