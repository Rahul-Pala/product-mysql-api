const userModel = require("../models/userModel");

const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await userModel.findUserById(req.userId);

      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      if (user.role !== requiredRole) {
        return res.status(403).json({
          message: "Access denied"
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = requireRole;
