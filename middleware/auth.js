const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.get("Authorization") || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  const token = authHeader.slice(7);

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not configured.");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch {
    return res.status(401).json({
      message: "Your login has expired or is not valid. Please log in again.",
    });
  }
}

function requireStaff(req, res, next) {
  if (req.user?.role !== "staff") {
    return res.status(403).json({
      message: "Staff access is required for this action.",
    });
  }

  next();
}

module.exports = { authenticate, requireStaff };
