// controllers/appointment.controller.js
import appointmentHelper from "../helpers/appointmentHelper.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";
import { createNotification } from "./notification.controller.js";
import visitorHelper from "../helpers/visitorHelper.js";
import { createNotificationService } from "../services/notification.services.js";

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentHelper.addObject(req.body);
    const visitor = await visitorHelper.getObjectById({
      id: appointment.visitor,
    });

    await createNotificationService({
      user: appointment.host,
      userModel: "Host",
      title: `New Appointment for ${visitor.name}`,
      message: `You have a new appointment with ${visitor.name} on ${appointment.date} at ${appointment.time}`,
      type: "NEW_APPOINTMENT",
      relatedAppointment: appointment._id,
      relatedVisitor: appointment.visitor,
      relatedHost: appointment.host,
    });

    return successResponse(
      res,
      201,
      "Appointment created successfully",
      appointment
    );
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentHelper.getObjectById({
      id: req.params.id,
      populatedQuery: [
        {
          path: "visitor",
          select: "name phone photo aadhaarNumber",
        },
        {
          path: "host",
          select: "name email phone department designation cabinNumber",
        },
        {
          path: "floor",
          select: "buildingName floorNumber floorLabel",
        },
      ],
    });

    return successResponse(
      res,
      200,
      "Appointment fetched successfully",
      appointment
    );
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const { filter, pageNum, pageSize, select } = req.body;

    let input = { pageNum, pageSize };
    if (filter) input.query = filter;
    if (select) input.selectFrom = select;

    // POPULATE visitor & host automatically
    input.populatedQuery = [
      { path: "visitor", select: "name phone aadhaar photo" },
      { path: "host", select: "name email phone department floor" },
      { path: "floor", select: "name floorLabel floorNumber" },
    ];

    const appointments = await appointmentHelper.getAllObjects(input);

    return successResponse(
      res,
      200,
      "Appointments fetched successfully",
      appointments
    );
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentHelper.updateObject(
      req.params.id,
      req.body
    );

    return successResponse(
      res,
      200,
      "Appointment updated successfully",
      appointment
    );
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    await appointmentHelper.deleteObjectById(req.params.id);
    return successResponse(res, 200, "Appointment deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
