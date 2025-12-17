import express from "express";
import { createStudent, getStudentById, getAllStudents, updateStudent, deleteStudent, createManyStudents } from "../controller/students.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  validateCreateStudent,
  validateUpdateStudent,
} from "../Validations/student.Validation.js";
import logger from "../logs/logger.js";

const router = express.Router();

// CREATE (Admin only)
router.post(
  "/",
  (req, res, next) => {
    logger.info("➡️ POST /student — Create Student route called");
    next();
  },
  // authMiddleware,
  // authorizeRoles("Admin"),
  validateCreateStudent,
  createStudent
);
router.post(
  "/bulk",
  (req, res, next) => {
    logger.info("➡️ POST /student/bulk — Create Many Students route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin"),
  createManyStudents
)

// GET single Host
router.get(
  "/:id",
  (req, res, next) => {
    logger.info("➡️ GET /student/:id — Get Student by ID route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin", "student"),
  getStudentById
);

// GET all Hosts
router.post(
  "/list",
  (req, res, next) => {
    logger.info("➡️ POST /student/list — Get All Students route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin"),
  getAllStudents
);

// UPDATE Host
router.put(
  "/:id",
  (req, res, next) => {
    logger.info("➡️ PUT /student/:id — Update Student by ID route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin"),
  validateUpdateStudent,
  updateStudent
);

// DELETE Host
router.delete(
  "/:id",
  (req, res, next) => {
    logger.info("➡️ DELETE /student/:id — Delete Student by ID route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin"),
  deleteStudent
);

export default router;
