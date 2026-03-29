const express = require("express");
const router = express.Router();

// Import Semester model (for reference, not directly used here - controllers use it)
const Semester = require("../models/Semester");

// Import auth middleware
const { verifyToken } = require("../middleware/auth");

const {
  getAllSemesters, // GET /api/semesters
  createSemester, // POST /api/semesters
  addCourseToSemester, // POST /api/semesters/:semesterId/courses
  updateCourseInSemester, // PUT /api/semesters/:semesterId/courses/:courseId
  deleteCourseFromSemester, // DELETE /api/semesters/:semesterId/courses/:courseId
} = require("../controllers/Semester.controller");

// All semester routes require authentication
router.get("/semesters", verifyToken, getAllSemesters);

/**
 * Creates a new semester
 * Request body: { name: string, courses: array (optional) }
 * Returns: Created semester object with MongoDB _id
 */
router.post("/semesters", verifyToken, createSemester);

/**
 * :semesterId: MongoDB ID of the semester
 * Request body: { courseTitle, creditUnit, grade }
 * Returns: Updated semester object with new course added
 */
router.post("/semesters/:semesterId/courses", verifyToken, addCourseToSemester);

/**
 * :semesterId: MongoDB ID of the semester
 * :courseId: MongoDB ID of the course to update
 * Request body: { courseTitle, creditUnit, grade } (fields to update)
 * Returns: Updated semester object
 */
router.put(
  "/semesters/:semesterId/courses/:courseId",
  verifyToken,
  updateCourseInSemester,
);

/**
 * :semesterId: MongoDB ID of the semester
 * :courseId: MongoDB ID of the course to delete
 * Returns: Success message
 */
router.delete(
  "/semesters/:semesterId/courses/:courseId",
  verifyToken,
  deleteCourseFromSemester,
);

module.exports = router;
