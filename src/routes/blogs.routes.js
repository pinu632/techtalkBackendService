import express from "express";
import {
  createBlog,
  autoSaveBlogContent,
  getBlogsByAuthor,
  getDraftBlogsByAuthor,
  getBlogById,
  getPublishedBlogs,
  getBlogsByCategory,
  updateBlog,
  deleteBlog,
} from "../controller/blog.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import logger from "../logs/logger.js";

const router = express.Router();

/* ----------------------------------
   CREATE BLOG (Metadata)
---------------------------------- */
router.post(
  "/",

//   authorizeRoles("Student", "Admin"),
  (req, res, next) => {
    logger.info("Create Blog API called", {
      user: req.user?.id,
      body: req.body,
    });
    next();
  },
  createBlog
);

/* ----------------------------------
   AUTOSAVE BLOG CONTENT
---------------------------------- */
router.post(
  "/autosave",

  (req, res, next) => {
    logger.info("Autosave Blog API called", {
      user: req.user?.id,
      blogId: req.body?.blogId,
    });
    next();
  },
  autoSaveBlogContent
);

/* ----------------------------------
   GET BLOGS BY AUTHOR
---------------------------------- */
router.get(
  "/author/:authorId",

  (req, res, next) => {
    logger.info("Get Blogs By Author API called", {
      authorId: req.params.authorId,
    });
    next();
  },
  getBlogsByAuthor
);

/* ----------------------------------
   GET DRAFT BLOGS BY AUTHOR
---------------------------------- */
router.get(
  "/drafts/:authorId",
  (req, res, next) => {
    logger.info("Get Draft Blogs API called", {
      authorId: req.params.authorId,
    });
    next();
  },
  getDraftBlogsByAuthor
);

/* ----------------------------------
   GET BLOG BY ID
---------------------------------- */
router.get(
  "/:id",

  (req, res, next) => {
    logger.info("Get Blog By ID API called", {
      blogId: req.params.id,
    });
    next();
  },
  getBlogById
);

/* ----------------------------------
   GET ALL PUBLISHED BLOGS (PUBLIC)
---------------------------------- */
router.get(
  "/",
  (req, res, next) => {
    logger.info("Get Published Blogs API called");
    next();
  },
  getPublishedBlogs
);

/* ----------------------------------
   GET BLOGS BY CATEGORY
---------------------------------- */
router.get(
  "/category/:category",
  (req, res, next) => {
    logger.info("Get Blogs By Category API called", {
      category: req.params.category,
    });
    next();
  },
  getBlogsByCategory
);

/* ----------------------------------
   UPDATE BLOG (AUTHOR / ADMIN)
---------------------------------- */
router.put(
  "/:id",

  authorizeRoles("Student", "Admin"),
  (req, res, next) => {
    logger.info("Update Blog API called", {
      blogId: req.params.id,
      user: req.user?.id,
      body: req.body,
    });
    next();
  },
  updateBlog
);

/* ----------------------------------
   DELETE BLOG (ADMIN)
---------------------------------- */
router.delete(
  "/:id",

  authorizeRoles("Admin"),
  (req, res, next) => {
    logger.info("Delete Blog API called", {
      blogId: req.params.id,
      user: req.user?.id,
    });
    next();
  },
  deleteBlog
);

export default router;
