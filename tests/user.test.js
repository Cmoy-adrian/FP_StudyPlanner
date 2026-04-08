const { sequelize, User } = require("../models");

describe("User model tests", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should hash password before saving user", async () => {

    const user = await User.create({
      username: "hashTest",
      email: "hash@test.com",
      password: "plaintext123"
    });

    expect(user.password).not.toBe("plaintext123");

  });

  test("validatePassword should return true for correct password", async () => {

    const user = await User.create({
      username: "passwordCheck",
      email: "password@test.com",
      password: "correctPassword"
    });

    const foundUser = await User.scope("withPassword").findOne({
      where: { email: "password@test.com" }
    });

    const result = await foundUser.validatePassword("correctPassword");

    expect(result).toBe(true);

  });

  test("validatePassword should return false for incorrect password", async () => {

    const user = await User.create({
      username: "passwordFail",
      email: "fail@test.com",
      password: "correctPassword"
    });

    const foundUser = await User.scope("withPassword").findOne({
      where: { email: "fail@test.com" }
    });

    const result = await foundUser.validatePassword("wrongPassword");

    expect(result).toBe(false);

  });

  test("defaultScope should hide password field", async () => {

    await User.create({
      username: "scopeTest",
      email: "scope@test.com",
      password: "password123"
    });

    const user = await User.findOne({
      where: { email: "scope@test.com" }
    });

    expect(user.password).toBeUndefined();

  });

  test("withPassword scope should include password field", async () => {

    await User.create({
      username: "scopeInclude",
      email: "scopeinclude@test.com",
      password: "password123"
    });

    const user = await User.scope("withPassword").findOne({
      where: { email: "scopeinclude@test.com" }
    });

    expect(user.password).toBeDefined();

  });

  test("role should default to user", async () => {

    const user = await User.create({
      username: "defaultRole",
      email: "default@test.com",
      password: "password123"
    });

    expect(user.role).toBe("user");

  });

  test("should reject invalid role value", async () => {

    await expect(User.create({
      username: "invalidRole",
      email: "invalidrole@test.com",
      password: "password123",
      role: "superuser"
    })).rejects.toThrow();

  });

  test("should reject invalid email format", async () => {

    await expect(User.create({
      username: "badEmail",
      email: "not-an-email",
      password: "password123"
    })).rejects.toThrow();

  });

  test("should reject short username", async () => {

    await expect(User.create({
      username: "ab",
      email: "short@test.com",
      password: "password123"
    })).rejects.toThrow();

  });

});