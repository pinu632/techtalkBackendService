// controllers/visitor.controller.js
import visitorHelper from "../helpers/visitorhelper.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";

export const createVisitor = async (req, res, next) => {
  try {
    const visitor = await visitorHelper.addObject(req.body);
    return successResponse(res, 201, "Visitor created successfully", visitor);
  } catch (error) {
    next(error);
  }
};

export const getVisitorById = async (req, res, next) => {
  try {
    const visitor = await visitorHelper.getObjectById({ id: req.params.id });
    return successResponse(res, 200, "Visitor fetched successfully", visitor);
  } catch (error) {
    next(error);
  }
};

export const getAllVisitors = async (req, res, next) => {
  try {
    const { filter, pageNum, pageSize, select } = req.body;

    let input = { pageNum, pageSize };
    if (filter) input.query = filter;
    if (select) input.selectFrom = select;

    const visitors = await visitorHelper.getAllObjects(input);

    return successResponse(res, 200, "Visitors fetched successfully", visitors);
  } catch (error) {
    next(error);
  }
};

export const updateVisitor = async (req, res, next) => {
  try {
    const visitor = await visitorHelper.updateObject(req.params.id, req.body);
    return successResponse(res, 200, "Visitor updated successfully", visitor);
  } catch (error) {
    next(error);
  }
};

export const deleteVisitor = async (req, res, next) => {
  try {
    await visitorHelper.deleteObjectById(req.params.id);
    return successResponse(res, 200, "Visitor deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
