import AppError from "../../handlers/AppError.js";
import { successResponse } from "../../handlers/responsehandler.js";
import notesHelper from "./notes.helper.js";

export const createNote = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subject,
      course,
      semester,
      unit,
      tags,
      fileUrl,
      fileType,
      sharedBy,
      visibility,
      status,
    } = req.body;

    if (!title || !subject || !fileUrl || !sharedBy) {
      throw new AppError(
        "Title, subject, fileUrl, and sharedBy are required",
        400
      );
    }

    const note = await notesHelper.addObject({
      title,
      description,
      subject,
      course,
      semester,
      unit,
      tags,
      fileUrl,
      fileType,
      sharedBy,
      visibility,
      status,
    });

    return successResponse(res, 201, "Note created successfully", note);
  } catch (error) {
    next(error);
  }
};

export const getAllPublishedNotes = async (req, res, next) => {
  try {
    const notes = await notesHelper.getAllObjects({
      query: {
        visibility: "public",
        status: "published",
      },
      sortBy: { createdAt: -1 },
      populatedQuery: {
        path: "sharedBy",
        select: "name rollNo profilePic class",
      },
    });

    return successResponse(res, 200, "Notes fetched successfully", notes);
  } catch (error) {
    next(error);
  }
};

export const getNotesByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      throw new AppError("Student ID is required", 400);
    }

    const notes = await notesHelper.getAllObjects({
      query: { sharedBy: studentId },
      sortBy: { createdAt: -1 },
    });

    return successResponse(res, 200, "Student notes fetched successfully", notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await notesHelper.getObjectById({
      id: req.params.id,
      populatedQuery: {
        path: "sharedBy",
        select: "name rollNo profilePic class course semester",
      },
    });

    return successResponse(res, 200, "Note fetched successfully", note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const note = await notesHelper.updateObject(req.params.id, req.body);
    return successResponse(res, 200, "Note updated successfully", note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    await notesHelper.deleteObjectById(req.params.id);
    return successResponse(res, 200, "Note deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
