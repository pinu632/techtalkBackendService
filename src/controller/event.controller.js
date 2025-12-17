import EventHelper from "../helpers/eventHelpers.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";




export const createEvent = async (req, res, next) => {
  try {
    const eventData = req.body;

    // 1. Create Event
    const event = await EventHelper.addObject(eventData);

    return successResponse(res, 201, "Event created successfully", event);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const populatedQuery = {
      path: "coordinators",
      select: "student role",
    };
    const event = await EventHelper.getObjectById({
      id: req.params.id,
      populatedQuery,
    });
    return successResponse(res, 200, "Event fetched successfully", event);
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (req, res, next) => { // Corrected function name from getAllEvents to getAllEvents
  try {
    const { filter, pageNum, pageSize, select } = req.body;
    let input = { pageNum, pageSize };
    if (filter) input.query = filter;
    if (select) input.selectFrom = select;
    input.populatedQuery = {
      path: "coordinators",
      select: "student role",
    };

    const events = await EventHelper.getAllObjects(input);

    return successResponse(res, 200, "Events fetched successfully", events);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await EventHelper.updateObject(req.params.id, req.body);
    return successResponse(res, 200, "Event updated successfully", event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    await EventHelper.deleteObjectById(req.params.id);
    return successResponse(res, 200, "Event deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
