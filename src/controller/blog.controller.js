import blogsHelper from "../helpers/BlogsHelper.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";


export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      read_time,
      category,
      cover,
      authorId,
    } = req.body;

    if (!title || !excerpt || !category || !authorId) {
      throw new AppError("Title, excerpt, category, and authorId are required", 400);
    }

    const blogData = {
      title,
      excerpt,
      read_time,
      category,
      cover,
      author: authorId, // Mongo ObjectId
      status: "Draft",
      content: "", // empty initially
    };
    
    const blog = await blogsHelper.addObject(blogData);
  

    return successResponse(res, 201, "Blog created successfully", blog);
  } catch (error) {
    next(error);
  }
};


export const autoSaveBlogContent = async (req, res, next) => {
  try {
    const { blogId, content, authorId } = req.body;

    if (!blogId || !content || !authorId) {
      throw new AppError("Blog ID, content, and authorId are required", 400);
    }

    const blog = await blogsHelper.updateObjectByQuery(
      {
        _id: blogId,
        author: authorId,
      },
      { content }
    );

    return successResponse(res, 200, "Blog autosaved successfully", blog);
  } catch (error) {
    next(error);
  }
};


export const getBlogsByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    const blogs = await blogsHelper.getAllObjects({
      query: { author: authorId },
      sortBy: { createdAt: -1 },
    });

    return successResponse(res, 200, "Blogs fetched successfully", blogs);
  } catch (error) {
    next(error);
  }
};


export const getDraftBlogsByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    if (!authorId) {
      throw new AppError("Author ID is required", 400);
    }

    const blogs = await blogsHelper.getAllObjects({
      query: {
        author: authorId,
        status: "Draft",
      },
      sortBy: { createdAt: -1 },
    });

    return successResponse(res, 200, "Draft blogs fetched successfully", blogs);
  } catch (error) {
    next(error);
  }
};


export const getBlogById = async (req, res, next) => {
  try {
    const blog = await blogsHelper.getObjectById({
      id: req.params.id,
      populatedQuery: {
        path: "author",
        select: "name rollno profilePic",
      },
    });

    return successResponse(res, 200, "Blog fetched successfully", blog);
  } catch (error) {
    next(error);
  }
};


export const getPublishedBlogs = async (req, res, next) => {
  try {
    const blogs = await blogsHelper.getAllObjects({
      query: { status: "Published" },
      sortBy: { createdAt: -1 },
      populatedQuery: {
        path: "author",
        select: "name profilePic class",
      },
    });

    return successResponse(res, 200, "Published blogs fetched successfully", blogs);
  } catch (error) {
    next(error);
  }
};


export const getBlogsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const blogs = await blogsHelper.getAllObjects({
      query: {
        category,
        status: "Published",
      },
      sortBy: { createdAt: -1 },
    });

    return successResponse(res, 200, "Blogs fetched successfully", blogs);
  } catch (error) {
    next(error);
  }
};


export const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogsHelper.updateObject(req.params.id, req.body);
    return successResponse(res, 200, "Blog updated successfully", blog);
  } catch (error) {
    next(error);
  }
};


export const deleteBlog = async (req, res, next) => {
  try {
    await blogsHelper.deleteObjectById(req.params.id);
    return successResponse(res, 200, "Blog deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
