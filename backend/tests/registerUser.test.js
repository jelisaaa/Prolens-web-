const request = require("supertest");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("Register User API", () => {
  const buildUserPayload = (overrides = {}) => {
    const stamp = Date.now();
    return {
      username: `testuser${stamp}`,
      email: `test${stamp}@gmail.com`,
      password: "securepassword123",
      confirmPassword: "securepassword123",
      phoneNumber: `98${String(stamp).slice(-8)}`,
      ...overrides,
    };
  };

  it("should register successfully with valid data", async () => {
    const payload = buildUserPayload();

    const res = await request(BASE_URL).post("/api/user/register").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(payload.email);
    expect(res.body.user.username).toBe(payload.username);
  });

  it("should fail when required fields are missing", async () => {
    const payload = buildUserPayload({ email: "" });

    const res = await request(BASE_URL).post("/api/user/register").send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Please enter all required fields");
  });

  it("should fail when password is less than 8 characters", async () => {
    const payload = buildUserPayload({
      password: "short1",
      confirmPassword: "short1",
    });

    const res = await request(BASE_URL).post("/api/user/register").send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Password must be at least 8 characters long");
  });

  it("should fail when passwords do not match", async () => {
    const payload = buildUserPayload({
      confirmPassword: "differentpassword123",
    });

    const res = await request(BASE_URL).post("/api/user/register").send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Passwords do not match");
  });

  it("should fail when user already exists with same email", async () => {
    const firstUser = buildUserPayload();
    await request(BASE_URL).post("/api/user/register").send(firstUser);

    const secondUser = buildUserPayload({
      email: firstUser.email,
      username: `${firstUser.username}_new`,
    });

    const res = await request(BASE_URL).post("/api/user/register").send(secondUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User already exists with this email");
  });
});
