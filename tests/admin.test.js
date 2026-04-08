const request = require("supertest");
const app = require("../server");

const { sequelize, User } = require("../models");

let adminToken;
let userToken;
let testUserId;

beforeEach(async () => {

  await sequelize.sync({ force: true });

  // Create admin
  const admin = await User.create({
    username: "adminUser",
    email: "admin@test.com",
    password: "password123",
    role: "admin"
  });

  // Create normal user
  const user = await User.create({
    username: "normalUser",
    email: "user@test.com",
    password: "password123",
    role: "user"
  });

  testUserId = user.id;

  // Login admin
  const adminLogin = await request(app)
    .post("/auth/login")
    .send({
      email: "admin@test.com",
      password: "password123"
    });

  adminToken = adminLogin.body.token;

  // Login normal user
  const userLogin = await request(app)
    .post("/auth/login")
    .send({
      email: "user@test.com",
      password: "password123"
    });

  userToken = userLogin.body.token;

});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /admin/users", () => {

  test("admin should retrieve all users", async () => {

    const response = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);

  });

  test("normal user should be blocked", async () => {

    const response = await request(app)
      .get("/admin/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);

  });

  test("unauthenticated request should fail", async () => {

    const response = await request(app)
      .get("/admin/users");

    expect(response.statusCode).toBe(401);

  });

});

describe("PATCH /admin/users/:id/role", () => {

  test("admin should update user role", async () => {

    const response = await request(app)
      .patch(`/admin/users/${testUserId}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "admin"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.role).toBe("admin");

  });

  test("should reject invalid role value", async () => {

    const response = await request(app)
      .patch(`/admin/users/${testUserId}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "superuser"
      });

    expect(response.statusCode).toBe(400);

  });

  test("normal user should be blocked", async () => {

    const response = await request(app)
      .patch(`/admin/users/${testUserId}/role`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        role: "admin"
      });

    expect(response.statusCode).toBe(403);

  });

});

describe("DELETE /admin/user/:id", () => {

  test("admin should delete another user", async () => {

    const response = await request(app)
      .delete(`/admin/user/${testUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);

  });

  test("admin should NOT delete themselves", async () => {

    const admin = await User.findOne({
      where: { email: "admin@test.com" }
    });

    const response = await request(app)
      .delete(`/admin/user/${admin.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(400);

  });

  test("normal user should be blocked", async () => {

    const response = await request(app)
      .delete(`/admin/user/${testUserId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);

  });

});