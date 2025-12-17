import Student from "../models/students.model.js";

export const findUserByRollNo = async (rollNo) => {
  const student = await Student.findOne({ rollNo });
  return student;
};