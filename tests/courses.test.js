const request = require("supertest");
const app = require("../server");

const db = require("../database/db");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll(async () => {
  await db.close();
});

describe("POST /courses", () => {

  test("should create a course successfully", async () => {

    const response = await request(app)
      .post("/courses")
      .send({
        name: "Calculus II"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Calculus II");

  });


  test("should fail if course name missing", async () => {

    const response = await request(app)
      .post("/courses")
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Course name is required");

  });

});

describe("GET /courses/:id", () => {

  test("should return a course by id", async () => {

    const course = await request(app)
      .post("/courses")
      .send({ name: "Physics" });

    const response = await request(app)
      .get(`/courses/${course.body.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Physics");

  });


  test("should return 404 if course not found", async () => {

    const response = await request(app)
      .get("/courses/999");

    expect(response.statusCode).toBe(404);

  });

});