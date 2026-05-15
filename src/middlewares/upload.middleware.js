import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const sanitizeFileName = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "file";

const supportedMimeTypes = {
  "image/jpeg": {
    format: "jpg",
    resourceType: "image",
  },
  "image/jpg": {
    format: "jpg",
    resourceType: "image",
  },
  "image/png": {
    format: "png",
    resourceType: "image",
  },
  "application/pdf": {
    format: "pdf",
    resourceType: "raw",
  },
  "application/msword": {
    format: "doc",
    resourceType: "raw",
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    format: "docx",
    resourceType: "raw",
  },
};

const buildPublicId = (file, fileConfig) => {
  const baseName = `${sanitizeFileName(file.originalname)}-${Date.now()}`;

  if (fileConfig.resourceType === "raw") {
    return `${baseName}.${fileConfig.format}`;
  }

  return baseName;
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileConfig = supportedMimeTypes[file.mimetype];

    if (!fileConfig) {
      throw new Error("Unsupported file type");
    }

    return {
      folder: "TechTalkGallery",
      public_id: buildPublicId(file, fileConfig),
      resource_type: fileConfig.resourceType,
      format: fileConfig.format,
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx"],
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (supportedMimeTypes[file.mimetype]) {
    cb(null, true);
    return;
  }

  cb(new Error("Only jpg, jpeg, png, pdf, doc, and docx files are allowed"));
};

export const upload = multer({ storage, fileFilter });
