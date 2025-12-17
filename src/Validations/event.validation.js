import Joi from "joi";
import AppError from "../handlers/AppError.js";
import mongoose from "mongoose";

// ENUM OPTIONS
const typeOptions = ["Tech", "Non Tech", "Seminar", "Expert Talk"];
const coordinatorRoleOptions = ["Lead", "Support", "Volunteer"];
const statusOptions = ["Upcoming", "Ongoing", "Completed", "Active"];

// Custom validator for ObjectId
const isObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId format");
  }
  return value;
};

/* ===========================================================
   📌 VALIDATE EVENT CREATION
   ============================================================ */
export const validateCreateEvent = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),

    type: Joi.string().valid(...typeOptions).required(),

    scheduled_date: Joi.date().required(),

    start_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // HH:mm
    end_time: Joi.string().pattern(/^\d{2}:\d{2}$/).optional(),

    poster_link: Joi.string().uri().optional(),
    rules: Joi.string().optional(),
    rules_link: Joi.string().uri().optional(),

    coordinators: Joi.array()
      .items(
        Joi.object({
          student: Joi.string().custom(isObjectId).required(),
          name: Joi.string().optional(),
          role: Joi.string().valid(...coordinatorRoleOptions).optional(),
        })
      )
      .optional(),

    report: Joi.string().optional(),
    venue: Joi.string().trim().optional(),
    description: Joi.string().optional(),

    status: Joi.string().valid(...statusOptions).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  next();
};

/* ===========================================================
   📌 VALIDATE EVENT UPDATE
   ============================================================ */
export const validateUpdateEvent = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().optional(),

    type: Joi.string().valid(...typeOptions).optional(),

    scheduled_date: Joi.date().optional(),

    start_time: Joi.string().pattern(/^\d{2}:\d{2}$/).optional(),
    end_time: Joi.string().pattern(/^\d{2}:\d{2}$/).optional(),

    poster_link: Joi.string().uri().optional(),
    rules: Joi.string().optional(),
    rules_link: Joi.string().uri().optional(),

    coordinators: Joi.array()
      .items(
        Joi.object({
          student: Joi.string().custom(isObjectId).required(),
          name: Joi.string().optional(),
          role: Joi.string().valid(...coordinatorRoleOptions).optional(),
        })
      )
      .optional(),

    report: Joi.string().optional(),
    venue: Joi.string().trim().optional(),
    description: Joi.string().optional(),

    status: Joi.string().valid(...statusOptions).optional(),
  }).min(1); // must update at least 1 field

  const { error } = schema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  next();
};
