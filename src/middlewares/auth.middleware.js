import jwt from "jsonwebtoken";
import AppError from "../handlers/AppError.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return next(new AppError("No token provided", 401));

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return next(new AppError("Invalid or expired token", 401));

      req.user = user; // { id, role }
      next();
    });
  } catch (error) {
    next(error);
  }
};
