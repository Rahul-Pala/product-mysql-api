const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  try {
    // 1. Get email and password from the request
    const { email, password } = req.body || {};

    // 2. Validate the information
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message: "Enter a valid email and a password of 8–72 bytes"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check whether the email already exists
    const existingUser = await userModel.findUserByEmail(
      normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // 4. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Save the user in MySQL
    const userId = await userModel.createUser(
      normalizedEmail,
      passwordHash
    );

    // 6. Send a success response
    return res.status(201).json({
      message: "User registered successfully",
      id: userId
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Duplicate email can also happen during simultaneous requests
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const login = async (req, res) => {
  try {
    // 1. Get email and password
    const { email, password } = req.body || {};

    // 2. Validate the request
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Valid email and password are required"
      });
    }

    // 3. Find the user in MySQL
    const user = await userModel.findUserByEmail(
      email.trim().toLowerCase()
    );

    // 4. Check whether the password matches
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 5. Check JWT configuration
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // 6. Generate a JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 7. Return the token
    return res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};



const getProfile = async (req, res) => {
  try {
    // Get user ID from authentication middleware
    const userId = req.userId;

    // Find the user in MySQL
    const user = await userModel.findUserById(userId);

    // Check whether the user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Send the user's details
    res.status(200).json({
      message: "Profile retrieved successfully",
      user
    });

  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};



module.exports = { register, login, getProfile };


// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel");

// // REGISTER USER
// const register = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (typeof email !== "string" || typeof password !== "string") {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const existingUser = await userModel.findUserByEmail(email);

//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const userId = await userModel.createUser(email, hashedPassword);

//     res.status(201).json({
//       message: "User registered successfully",
//       id: userId
//     });

//   } catch (error) {
//     if (error.code === "ER_DUP_ENTRY") {
//       return res.status(409).json({ message: "User already exists" });
//     }

//     res.status(500).json({ message: "Server error" });
//   }
// };


// // LOGIN USER
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (typeof email !== "string" || typeof password !== "string") {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     const user = await userModel.findUserByEmail(email);

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password_hash);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!process.env.JWT_SECRET) {
//       return res.status(500).json({ message: "Server configuration error" });
//     }

//     const token = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { register, login };

