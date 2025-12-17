import studentHelper from "../helpers/studentsHelper.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";
import { findUserByRollNo } from "../utils/findUser.js";

export const createStudent = async (req, res, next) => {
  try {
    const { password, rollNo } = req.body;
    const result = await findUserByRollNo(rollNo);
    if (result) return next(new AppError("Student already exists", 400));

    if (!password) {
      password = rollNo;
    }

    const newBody = {
      ...req.body,
      password,
    };

    const newStudent = await studentHelper.addObject(newBody);

    return successResponse(
      res,
      201,
      "Student created successfully",
      newStudent
    );
  } catch (error) {
    next(error);
  }
};

export const createManyStudents = async (req, res, next) => {
  try {
    const students = req.body.students; // array of {name, rollNo, class}

    if (!Array.isArray(students) || students.length === 0) {
      return next(new AppError("Students data must be a non-empty array", 400));
    }

    let created = [];
    let skipped = [];

    for (const student of students) {
      const { rollNo } = student;

      if (!rollNo) {
        skipped.push({ ...student, reason: "Missing rollNo" });
        continue;
      }

      // Check if already exists
      const exists = await findUserByRollNo(rollNo);
      if (exists) {
        skipped.push({ ...student, reason: "Already exists" });
        continue;
      }

      const newStudentData = {
        ...student,
        password: rollNo, // AUTO PASSWORD = ROLL NO
      };

      const newStudent = await studentHelper.addObject(newStudentData);
      created.push(newStudent);
    }

    return successResponse(res, 201, "Bulk upload completed", {
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await studentHelper.getObjectById({ id: req.params.id });
    return successResponse(res, 200, "Student fetched successfully", student);
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const { filter, pageNum, pageSize, select } = req.body;
    let input = { pageNum, pageSize };
    if (filter) input.query = filter;
    if (select) input.selectFrom = select;

    const students = await studentHelper.getAllObjects(input);
    const totalStudents = await studentHelper.getAllObjectCount(input);

    return successResponse(res, 200, "Students fetched successfully", {
      students,
      totalStudents,
    });
    
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await studentHelper.updateObject(req.params.id, req.body);
    return successResponse(res, 200, "Student updated successfully", student);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    await studentHelper.deleteObjectById(req.params.id);
    return successResponse(res, 200, "Student deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
