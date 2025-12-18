import registrationHelper from "../helpers/registrationHelper.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";
import StudentHelper from "../helpers/studentsHelper.js";

export const createRegistration = async (req, res, next) => {
  try {
    const { eventId, studentId } = req.body;

    if (!eventId || !studentId) {
      return next(new AppError("eventId and studentId are required", 400));
    }

    const exists = await registrationHelper.getObjectByQuery({
      query: { eventId, studentId },
    });

    if (exists) {
      return next(
        new AppError("Student already registered for this event", 400)
      );
    }

    const registration = await registrationHelper.addObject(req.body);

    return successResponse(
      res,
      201,
      "Registration created successfully",
      registration
    );
  } catch (error) {
    next(error);
  }
};

export const createManyRegistrations = async (req, res, next) => {
  try {
    const registrations = req.body.registrations;

    if (!Array.isArray(registrations) || registrations.length === 0) {
      return next(new AppError("registrations must be a non-empty array", 400));
    }

    let created = [];
    let skipped = [];

    for (const item of registrations) {
      const { eventId, studentId } = item;

      if (!eventId || !studentId) {
        skipped.push({ ...item, reason: "Missing eventId or studentId" });
        continue;
      }

      const exists = await registrationHelper.getObjectByQuery({
        query: { eventId, studentId },
      });

      if (exists) {
        skipped.push({ ...item, reason: "Already registered" });
        continue;
      }

      const reg = await registrationHelper.addObject(item);
      created.push(reg);
    }

    return successResponse(res, 201, "Bulk registration completed", {
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped,
    });
  } catch (error) {
    next(error);
  }
};

export const getRegistrationById = async (req, res, next) => {
  try {
    const registration = await registrationHelper.getObjectById({
      id: req.params.id,
      populatedQuery: ["eventId", "studentId"],
    });

    return successResponse(
      res,
      200,
      "Registration fetched successfully",
      registration
    );
  } catch (error) {
    next(error);
  }
};

export const getAllRegistrations = async (req, res, next) => {
  try {
    const { filter, pageNum = 1, pageSize = 10, select } = req.body;

    let input = { pageNum, pageSize };

    if (filter) input.query = filter;
    if (select) input.selectFrom = select;

    const registrations = await registrationHelper.getAllObjects(input);
    const totalRegistrations = await registrationHelper.getAllObjectCount(
      input
    );

    return successResponse(res, 200, "Registrations fetched successfully", {
      registrations,
      totalRegistrations,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRegistration = async (req, res, next) => {
  try {
    const updated = await registrationHelper.updateObject(
      req.params.id,
      req.body
    );

    return successResponse(
      res,
      200,
      "Registration updated successfully",
      updated
    );
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const { eventId, studentId } = req.body;

    if (!eventId || !studentId) {
      return next(new AppError("eventId and studentId are required", 400));
    }

    const updated = await registrationHelper.updateObjectByQuery(
      { eventId, studentId },
      {
        status: "attended",
        attendanceMarked: true,
        attendanceMarkedAt: new Date(),
      }
    );

    return successResponse(res, 200, "Attendance marked successfully", updated);
  } catch (error) {
    next(error);
  }
};

export const issueCertificate = async (req, res, next) => {
  try {
    const { eventId, studentId, certificateUrl } = req.body;

    if (!eventId || !studentId) {
      return next(new AppError("eventId and studentId are required", 400));
    }

    const updated = await registrationHelper.updateObjectByQuery(
      { eventId, studentId },
      {
        certificateIssued: true,
        certificateUrl,
      }
    );

    return successResponse(
      res,
      200,
      "Certificate issued successfully",
      updated
    );
  } catch (error) {
    next(error);
  }
};

export const deleteRegistration = async (req, res, next) => {
  try {
    await registrationHelper.deleteObjectById(req.params.id);

    return successResponse(res, 200, "Registration deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    const registrationId = req.params.id;

    const updated = await registrationHelper.updateObject(registrationId, {
      status: "cancelled",
      isActive: false,
    });

    return successResponse(
      res,
      200,
      "Registration cancelled successfully",
      updated
    );
  } catch (error) {
    next(error);
  }
};

export const cancelRegistrationByEventAndStudent = async (req, res, next) => {
  try {
    const { eventId, studentId } = req.body;

    if (!eventId || !studentId) {
      return next(new AppError("eventId and studentId are required", 400));
    }

    const updated = await registrationHelper.updateObjectByQuery(
      { eventId, studentId },
      {
        status: "cancelled",
        isActive: false,
      }
    );

    return successResponse(
      res,
      200,
      "Registration cancelled successfully",
      updated
    );
  } catch (error) {
    next(error);
  }
};

export const reactivateRegistration = async (req, res, next) => {
  try {
    const { eventId, studentId } = req.body;

    const updated = await registrationHelper.updateObjectByQuery(
      { eventId, studentId },
      {
        status: "registered",
        isActive: true,
      }
    );

    return successResponse(
      res,
      200,
      "Registration reactivated successfully",
      updated
    );
  } catch (error) {
    next(error);
  }
};

export const registerWithStudentCheck = async (req, res, next) => {
  try {
    const {
      eventId,
      rollNo,
      name,
      course,
      class: studentClass,
      semester,
    } = req.body;

    if (!eventId || !rollNo) {
      return next(new AppError("eventId and rollNo are required", 400));
    }

    // --------------------------------
    // FIND STUDENT BY ROLL NO
    // --------------------------------
    let student = await StudentHelper.getObjectByQuery({
      query: {
        rollNo,
      },
    });

    // --------------------------------
    // CREATE STUDENT IF NOT EXISTS
    // --------------------------------
    if (!student) {
      if (!name || !course || !studentClass) {
        return next(
          new AppError(
            "name, course and class are required for new student",
            400
          )
        );
      }

      student = await studentHelper.addObject({
        name,
        rollNo,
        course,
        class: studentClass,
        semester,
        password: rollNo, // AUTO PASSWORD
        role: ["Student"],
      });
    }

    // --------------------------------
    // PREVENT DUPLICATE REGISTRATION
    // --------------------------------
    const alreadyRegistered = await registrationHelper.getObjectByQuery({
      query: {
        eventId,
        studentId: student._id,
        status: { $ne: "cancelled" },
      },
    });

    if (alreadyRegistered) {
      return next(
        new AppError("Student already registered for this event", 400)
      );
    }

    // --------------------------------
    // REGISTER STUDENT
    // --------------------------------
    const registration = await registrationHelper.addObject({
      eventId,
      studentId: student._id,
      status: "registered",
      isActive: true,
    });

    return successResponse(res, 201, "Student registered successfully", {
      studentId: student._id,
      registrationId: registration._id,
    });
  } catch (error) {
    next(error);
  }
};


export const checkRegistrationStatus = async (req, res, next) => {
  try {
    const { eventId, studentId } = req.body;

    if (!eventId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "eventId and studentId are required",
      });
    }

    const registration = await registrationHelper.getObjectByQuery({
      eventId,
      studentId,
    });

    if (!registration) {
      return successResponse(res, 200, "Not registered", {
        isRegistered: false,
        status: null,
        isActive: false,
      });
    }

    return successResponse(res, 200, "Registration status fetched", {
      isRegistered: registration.status === "registered",
      status: registration.status,
      isActive: registration.isActive,
      registrationId: registration._id,
    });
  } catch (error) {
    next(error);
  }
};
