const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const response = require("../utils/responseHandler");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;
    console.log("Auth Token from cookies:", req.cookies);
    console.log("Token from cookies:", token);
    

    if (!token) {
      return response(res, 401, "Authorization token missing");
    }
    
    // 🔐 Verifies token AND checks expiry (7 days)
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, iat, exp }
    console.log(decoded)
    // 👤 Fetch user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return response(res, 401, "User not found");
    }

    // 🌍 Make user globally available
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response(res, 401, "Token expired. Please login again");
    }

    return response(res, 401, "Invalid authorization token");
  }
};

module.exports = authMiddleware;
