import Joi from "joi";
import AppError from "../handlers/AppError.js";

// Allowed class values
const classOptions = [
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "IT3",
  "IT4",
  "IT5",
  "IT6",
  "IT7",
  "IT8",
  "AI&ML3",
  "AI&ML4",
  "AI&ML5",
  "AI&ML6",
  "AI&ML7",
  "AI&ML8",
];

// Allowed status values
const statusOptions = ["Active", "Suspended", "Graduated"];

// Allowed role values
const roleOptions = ["Admin", "Member", "Student"];

/* ===========================================================
   📌 VALIDATE STUDENT CREATION
   ============================================================ */
export const validateCreateStudent = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),

    rollNo: Joi.string().required(),

    email: Joi.string().email().required(),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),

    course: Joi.string().required(),

    semester: Joi.number().min(1).max(8).required(),

    class: Joi.string()
      .valid(...classOptions)
      .required(),

    password: Joi.string().min(5).required(),

    role: Joi.array()
      .items(Joi.string().valid(...roleOptions))
      .optional(),

      profilePic: Joi.string().allow("").optional(),


    isVerified: Joi.boolean().optional(),

    status: Joi.string()
      .valid(...statusOptions)
      .optional(),

    lastLogin: Joi.date().optional(),

    failedAttempts: Joi.number().optional(),

    isLocked: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  next();
};

/* ===========================================================
   📌 VALIDATE STUDENT UPDATE
   ============================================================ */
export const validateUpdateStudent = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).optional(),

    rollNo: Joi.string().optional(),

    email: Joi.string().email().optional(),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional(),

    course: Joi.string().optional(),

    semester: Joi.number().min(1).max(8).optional(),

    class: Joi.string()
      .valid(...classOptions)
      .optional(),

    password: Joi.string().min(5).optional(),

    role: Joi.array()
      .items(Joi.string().valid(...roleOptions))
      .optional(),

    profilePic: Joi.string().uri().optional().allow(null),

    isVerified: Joi.boolean().optional(),

    status: Joi.string()
      .valid(...statusOptions)
      .optional(),

    lastLogin: Joi.date().optional(),

    failedAttempts: Joi.number().optional(),

    isLocked: Joi.boolean().optional(),
  }).min(1); // ensure update contains at least 1 field

  const { error } = schema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  next();
};
