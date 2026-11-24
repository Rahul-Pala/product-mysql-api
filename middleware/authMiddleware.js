const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // Check whether a Bearer token was provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save the user's ID on the request
    req.userId = decoded.userId;

    // Continue to the next function
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;

// curl -i -X POST http://localhost:3000/products \
//   -H "Content-Type: application/json" \
//   -H 
//   -d '{}'

// curl -i -X POST http://localhost:3000/products \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc5NTIxNDY5OCwiZXhwIjoxNzk1MjE4Mjk4fQ.X2bwqw49OfEpH0EU2tbYbYVzKAq9Y4QryYrQYqcbK0w" \
//   -d '{
//     "name": "Laptop",
//     "price": 1200,
//     "stock": 10
//   }'