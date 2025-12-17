import express from "express";
import { createEvent, getEventById, getAllEvents, updateEvent, deleteEvent } from "../controller/event.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  validateCreateEvent,
  validateUpdateEvent,
} from "../Validations/event.validation.js";

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin"),
  validateCreateEvent,
  createEvent
);
router.post(
  "/list",
  getAllEvents
);

router.get("/:id",
  authMiddleware,
  getEventById
);

// UPDATE Guard (ADMIN)
    router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  validateUpdateEvent,
  updateEvent
);

// DELETE Event (ADMIN)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  deleteEvent
);

export default router;
