import AppError from "../handlers/AppError.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.some(role => req.user.role.includes(role))) {
      return next(
        new AppError("You are not allowed to perform this action", 403)
      );
    }
    next();
  };
};
