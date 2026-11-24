const db = require("../db");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

describe("Authentication API", () => {

afterAll(async () => {
    await db.end();
  });
  // TEST 1: No JWT provided
  test("GET /auth/profile should reject requests without a token", async () => {

    const response = await request(app)
      .get("/auth/profile");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("No token provided");

  });

  // TEST 2: Invalid JWT provided
  test("GET /auth/profile should reject an invalid token", async () => {

    const response = await request(app)
      .get("/auth/profile")
      .set("Authorization", "Bearer fake123");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");

  });

// });


// TEST 3: Test a valid JWT
test("GET /auth/profile should accept a valid token", async () => {

  const passwordHash = await bcrypt.hash("TestPassword123", 10);

  const userId = await userModel.createUser(
    "profile-test@example.com",
    passwordHash
  );

  try {
    const token = jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.id).toBe(userId);

  } finally {
    await db.execute(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );
  }

})
})