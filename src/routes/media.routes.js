import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import ImageHelper from "../helpers/imageHelpers.js";
import { successResponse } from "../handlers/responsehandler.js";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    console.log(req);
    const { uploaded_by } = req.body;
    const newImage = await ImageHelper.addObject({
      url: req.file.path,
      storage_id: req.file.filename,
      metadata: {
        width: req.file.width,
        height: req.file.height,
        format: req.file.format,
        size_in_kb: req.file.size,
      },
      uploaded_by,
    });

    return res.json({
      success: true,
      _id: newImage._id,
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.post(
  "/upload-multiple",
  upload.array("photos", 1000),
  async (req, res) => {
    try {
      const { uploaded_by } = req.body;

      if (!req.files?.length) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const savedImages = [];

      for (const file of req.files) {
        // file.filename is the public_id in Cloudinary
        const publicId = file.filename;

        // Get metadata from Cloudinary
        const meta = await cloudinary.api.resource(publicId);

        const width = meta.width;
        const height = meta.height;
        const format = meta.format;
        const sizeKB = meta.bytes / 1024;

        // Save in DB
        const newImage = await ImageHelper.addObject({
          url: meta.secure_url,
          storage_id: publicId,
          metadata: { width, height, format, size_in_kb: sizeKB },
          uploaded_by,
          type: "Event",
        });

        savedImages.push({
          _id: newImage._id,
          url: meta.secure_url,
          public_id: publicId,
          width,
          height,
          format,
          sizeKB,
        });
      }

      return res.json({
        success: true,
        count: savedImages.length,
        images: savedImages,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

router.post("/update", async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    const image = await ImageHelper.updateObject(id, rest);
    return successResponse(res, 200, "Image updated successfully", image);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

router.post("/list", async (req, res) => {
  try {
    const { filter, pageNum = 1, pageSize = 20, select } = req.body;

    let input = { pageNum, pageSize };
    if (filter) input.query = filter;
    if (select) input.selectFrom = select;
    const images = await ImageHelper.getAllObjects(input);
    return successResponse(res, 200, "Images fetched successfully", images);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

router.post("/delete", async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new AppError("Image id is required", 400);
    }

    

    // 1. Find image
    const image = await ImageHelper.getObjectById({id});

    console.log(image)

    if (!image) {
      throw new AppError("Image not found", 404);
    }

    // 2. Authorization check
    // if (
    //   image.uploaded_by &&
    //   req.user &&
    //   String(image.uploaded_by) !== String(req.user.id)
    // ) {
    //   throw new AppError("Not allowed to delete this image", 403);
    // }

    // 3. Delete from Cloudinary
    if (image.storage_id) {
      const res = await cloudinary.uploader.destroy(image.storage_id);
      console.log(res);
    }
    console.log(image);
    // 4. Soft delete using helper
    await ImageHelper.updateObjectByQuery(
      { _id: image._id },
      {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: req.user?.id,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
