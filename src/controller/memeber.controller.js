import MemberHelper from "../helpers/memberHelper.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";

/**
 * ✅ Create Single Member
 * - Ensures 1:1 mapping with Student
 * - Prevents duplicate member for same student
 */
export const createMember = async (req, res, next) => {
  try {
    const { student, member_id, join_date } = req.body;

    if (!student || !member_id || !join_date) {
      return next(
        new AppError("student, member_id and join_date are required", 400)
      );
    }

    // Check if member already exists for this student
    const existingMember = await MemberHelper.getObjectByQuery({
      student,
    });

    if (existingMember) {
      return next(new AppError("Member already exists for this student", 400));
    }

    const newMember = await MemberHelper.addObject(req.body);

    return successResponse(res, 201, "Member created successfully", newMember);
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Create Multiple Members (Bulk)
 */
export const createManyMembers = async (req, res, next) => {
  try {
    const members = req.body.members;

    if (!Array.isArray(members) || members.length === 0) {
      return next(new AppError("Members must be a non-empty array", 400));
    }

    let created = [];
    let skipped = [];

    for (const member of members) {
      console.log(member);
      const { student, member_id, join_date } = member;

      if (!student || !member_id || !join_date) {
        skipped.push({
          ...member,
          reason: "Missing required fields",
        });
        continue;
      }

      const exists = await MemberHelper.getObjectByQuery({
        query: {
          student,
        },
      });

      console.log(JSON.stringify(exists) + "\n");

      if (exists) {
        skipped.push({
          ...member,
          reason: "Member already exists for this student",
        });
        continue;
      }

      const newMember = await MemberHelper.addObject(member);
      created.push(newMember);
    }

    return successResponse(res, 201, "Bulk member creation completed", {
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Get Member by ID
 */
export const getMemberById = async (req, res, next) => {
  try {
    const member = await MemberHelper.getObjectById({
      id: req.params.id,
      populate: ["student", "projects"],
    });

    return successResponse(res, 200, "Member fetched successfully", member);
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Get All Members (With filters & pagination)
 */
export const getAllMembers = async (req, res, next) => {
  try {
    const { filter, pageNum, pageSize, select, populate } = req.body;

    let input = { pageNum, pageSize };

    if (filter) input.query = filter;
    if (select) input.selectFrom = select;
    if (populate) input.populatedQuery = populate;


    const members = await MemberHelper.getAllObjects(input);
    const totalMembers = await MemberHelper.getAllObjectCount(input);

    return successResponse(res, 200, "Members fetched successfully", {
      members,
      totalMembers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Update Member
 */
export const updateMember = async (req, res, next) => {
  try {
    const updatedMember = await MemberHelper.updateObject(
      req.params.id,
      req.body
    );

    return successResponse(
      res,
      200,
      "Member updated successfully",
      updatedMember
    );
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Delete Member
 */
export const deleteMember = async (req, res, next) => {
  try {
    await MemberHelper.deleteObjectById(req.params.id);

    return successResponse(res, 200, "Member deleted successfully", {});
  } catch (error) {
    next(error);
  }
};
