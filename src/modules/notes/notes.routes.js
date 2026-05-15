import express from "express";
import logger from "../../logs/logger.js";
import {
  createNote,
  deleteNote,
  getAllPublishedNotes,
  getNoteById,
  getNotesByStudent,
  updateNote,
} from "./notes.controller.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  logger.info("Create Note API called", {
    body: req.body,
  });
  next();
}, createNote);

router.get("/", (req, res, next) => {
  logger.info("Get Published Notes API called");
  next();
}, getAllPublishedNotes);

router.get("/student/:studentId", (req, res, next) => {
  logger.info("Get Notes By Student API called", {
    studentId: req.params.studentId,
  });
  next();
}, getNotesByStudent);

router.get("/:id", (req, res, next) => {
  logger.info("Get Note By ID API called", {
    noteId: req.params.id,
  });
  next();
}, getNoteById);

router.put("/:id", (req, res, next) => {
  logger.info("Update Note API called", {
    noteId: req.params.id,
    body: req.body,
  });
  next();
}, updateNote);

router.delete("/:id", (req, res, next) => {
  logger.info("Delete Note API called", {
    noteId: req.params.id,
  });
  next();
}, deleteNote);

export default router;
