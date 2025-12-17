import bcrypt from "bcryptjs";
import AppError from "../handlers/AppError.js";
import { findUserByRollNo } from "../utils/findUser.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import Student from "../models/students.model.js";

export const login = async (req, res, next) => {
  try {
    const { rollNo, password } = req.body;

    const result = await findUserByRollNo(rollNo);
    if (!result) return next(new AppError("User not found", 404));

    const student = result;
    student.lastLogin = new Date();
    await student.save();

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) return next(new AppError("Invalid credentials", 401));

    const accessToken = generateAccessToken(student);
    const refreshToken = generateRefreshToken(student);

    return res.json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        rollNo: student.rollNo,
        course: student.course,
        semester: student.semester,
        class: student.class,

        role: student.role, // ["Student"] or ["Admin"]

        profilePic: student.profilePic,
        isVerified: student.isVerified,
        status: student.status, // Active, Suspended, Graduated

        lastLogin: student.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.body.refreshToken;

    if (!token) return next(new AppError("No refresh token", 401));

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return next(new AppError("Invalid refresh token", 403));

        // get user from DB
        let student = await Student.findOne({ _id: decoded.id });

        if (!student) return next(new AppError("Student no longer exists", 404));

        const newAccessToken = generateAccessToken(student);

        return res.json({
          success: true,
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next(new AppError("No token provided", 401));
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return next(new AppError("Invalid token", 401));
      // get user from DB
      let student =
        (await Student.findOne({ _id: decoded.id }));

      if (!student) return next(new AppError("Student no longer exists", 404));
      return res.json({
        success: true,
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          rollNo: student.rollNo,
          course: student.course,
          semester: student.semester,
          class: student.class,
          role: student.role, // ["Student"] or ["Admin"]
          profilePic: student.profilePic,
          isVerified: student.isVerified,
          status: student.status, // Active, Suspended, Graduated
          lastLogin: student.lastLogin,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

// export const verifyPin = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.json({ verified: false });

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
//       if (err) return res.json({ verified: false, error: err.message });

//       // find user
//       let user =
//         (await Host.findById(decoded.id)) || (await Guard.findById(decoded.id));

//       if (!user) return res.json({ verified: false });

//       // incoming PIN
//       const { pin } = req.body;

//       if (!pin) return res.json({ verified: false });

//       // match

//       if (user.pin === pin) {
//         return res.json({ verified: true });
//       } else {
//         return res.json({ verified: false });
//       }
//     });
//   } catch (error) {
//     return res.json({ verified: false });
//   }
// };
