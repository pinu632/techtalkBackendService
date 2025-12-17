// routes/visitor.routes.js
import express from "express";
import {
  createVisitor,
  getVisitorById,
  getAllVisitors,
  updateVisitor,
  deleteVisitor,
} from "../controller/visitor.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ===========================
     CREATE VISITOR
   =========================== */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "guard"),
  createVisitor
);

/* ===========================
     GET VISITOR BY ID
   =========================== */
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "guard"),
  getVisitorById
);

/* ===========================
     GET ALL VISITORS (Paginated)
   =========================== */
router.post(
  "/list",
  authMiddleware,
  authorizeRoles("admin", "guard"),
  getAllVisitors
);

/* ===========================
     UPDATE VISITOR
   =========================== */
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "guard"),
  updateVisitor
);

/* ===========================
     DELETE VISITOR
   =========================== */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteVisitor
);

export default router;
