import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
