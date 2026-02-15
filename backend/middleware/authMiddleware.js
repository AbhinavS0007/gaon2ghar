const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


exports.farmerOnly = (req, res, next) => {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Farmer access only" });
    }
    next();
  };
  
  exports.customerOnly = (req, res, next) => {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Customer access only" });
    }
    next();
  };
  