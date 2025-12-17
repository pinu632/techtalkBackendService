import ImageHelper from "../helpers/imageHelpers.js";
import { successResponse } from "../handlers/responsehandler.js";

export const uploadImage = async (req, res, next) => {
  try {
    const image = await ImageHelper.addObject(req.body);
    return successResponse(res, 200, "Image uploaded successfully", image);
  } catch (error) {
    next(error);
  }
};

export const getImageById = async (req, res, next) => {
  try {
    const image = await ImageHelper.getObjectById({ id: req.params.id });
    return successResponse(res, 200, "Image fetched successfully", image);
  } catch (error) {
    next(error);
  }
};

export const getAllImages = async (req, res, next) => {
  try {
    const images = await ImageHelper.getAllObjects();       
    return successResponse(res, 200, "Images fetched successfully", images);
  } catch (error) {
    next(error);
  }
};

export const updateImage = async (req, res, next) => {
    try {
        const image = await ImageHelper.updateObject(req.params.id, req.body);
        return successResponse(res, 200, "Image updated successfully", image);
    } catch (error) {
        next(error);
    }
};