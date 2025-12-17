import express from "express";


import {
  createMember,
  createManyMembers,
  getMemberById,
  getAllMembers,
  updateMember,
  deleteMember,
} from "../controller/memeber.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import logger from "../logs/logger.js";

const router = express.Router();

/**
 * =========================
 * CREATE MEMBER (Admin)
 * =========================
 */
router.post(
  "/",
  (req, res, next) => {
    logger.info("➡️ POST /member — Create Member route called");
    next();
  },
//   authMiddleware,
//   authorizeRoles("Admin"),
  createMember
);

/**
 * =========================
 * BULK CREATE MEMBERS (Admin)
 * =========================
 */
router.post(
  "/bulk",
  (req, res, next) => {
    logger.info("➡️ POST /member/bulk — Create Many Members route called");
    next();
  },
//   authMiddleware,
//   authorizeRoles("Admin"),
  createManyMembers
);

/**
 * =========================
 * GET MEMBER BY ID
 * =========================
 */
router.get(
  "/:id",
  (req, res, next) => {
    logger.info("➡️ GET /member/:id — Get Member by ID route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin", "student"),
  getMemberById
);

/**
 * =========================
 * GET ALL MEMBERS (Admin)
 * =========================
 */
router.post(
  "/list",
  (req, res, next) => {
    logger.info("➡️ POST /member/list — Get All Members route called");
    next();
  },
  // authMiddleware,
  // authorizeRoles("Admin"),
  getAllMembers
);

/**
 * =========================
 * UPDATE MEMBER (Admin)
 * =========================
 */
router.put(
  "/:id",
  (req, res, next) => {
    logger.info("➡️ PUT /member/:id — Update Member by ID route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin"),
  updateMember
);

/**
 * =========================
 * DELETE MEMBER (Admin)
 * =========================
 */
router.delete(
  "/:id",
  (req, res, next) => {
    logger.info("➡️ DELETE /member/:id — Delete Member by ID route called");
    next();
  },
  authMiddleware,
  authorizeRoles("Admin"),
  deleteMember
);

export default router;
