import express from "express";
import {
  createFloor,
  createManyFloors,
  getFloorById,
  getAllFloors,
  updateFloor,
  deleteFloor,
} from "../controller/floor.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

// import { validateCreateFloor, validateUpdateFloor } from "../Validations/floor.validation.js";
// (Validation commented for now)

const router = express.Router();

/* ===========================
     CREATE SINGLE FLOOR
   =========================== */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  // validateCreateFloor,
  createFloor
);

/* ===========================
     CREATE MULTIPLE FLOORS
   =========================== */
router.post(
  "/many",
  authMiddleware,
  authorizeRoles("admin"),
  createManyFloors
);

/* ===========================
     GET FLOOR BY ID
   =========================== */
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "guard"),
  getFloorById
);

/* ===========================
     GET ALL FLOORS
   =========================== */
router.post(
  "/list",
  authMiddleware,
  authorizeRoles("admin", "guard"),
  getAllFloors
);

/* ===========================
     UPDATE FLOOR
   =========================== */
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  // validateUpdateFloor,
  updateFloor
);

/* ===========================
     DELETE FLOOR
   =========================== */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteFloor
);

export default router;
