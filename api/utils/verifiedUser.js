// utils/verifiedUser.js
import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler("Unauthorized: No token provided", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return next(errorHandler("Unauthorized: Invalid token", 403));
    }

    // ✅ Attach the decoded user (should contain _id)
    req.user = decodedUser;
    next();
  });
};
