const Semester = require("../models/Semester");

/**
 * getAllSemesters Controller
 * GET /api/semesters
 * Retrieves all semesters for the authenticated user
 */
const getAllSemesters = async (req, res) => {
  try {
    // Filter semesters by the authenticated user's ID
    const semesters = await Semester.find({ userId: req.user.userId });

    res.status(200).json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * createSemester Controller
 * POST /api/semesters
 * Creates a new semester in the database for the authenticated user
 */
const createSemester = async (req, res) => {
  try {
    const { name, courses = [] } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Semester name is required" });
    }

    /**
     * Create new Semester instance with provided data
     * Include userId from authenticated user
     * This doesn't save to database yet, just creates instance in memory
     */
    const newSemester = new Semester({ userId: req.user.userId, name, courses });

    /**
     * Save semester to MongoDB database
     * After save, it gets a MongoDB _id and is stored in collection
     */
    const savedSemester = await newSemester.save();

    res.status(201).json(savedSemester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * addCourseToSemester Controller
 * POST /api/semesters/:semesterId/courses
 * Adds a new course to an existing semester
 */
const addCourseToSemester = async (req, res) => {
  // Extract semesterId from URL parameters (e.g., /semesters/123/courses)
  const { semesterId } = req.params;
  // The new course data from request body
  const courseData = req.body;

  try {
    const semester = await Semester.findById(semesterId);

    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    /**
     * Check if course with same title already exists in this semester
     * Use .some() to check if ANY course matches the condition
     * Compare titles case-insensitively by converting both to uppercase
     */
    const duplicate = semester.courses.some(
      (c) =>
        c.courseTitle.toUpperCase() === courseData.courseTitle.toUpperCase(),
    );

    if (duplicate) {
      return res
        .status(409)
        .json({ message: "Course title already exists in this semester" });
    }

    /**
     * Add the new course to semester's courses array
     * .push() adds the courseData object to the embedded array
     */
    semester.courses.push(courseData);

    /**
     * Save updated semester back to database
     * This persists the new course to MongoDB
     */
    await semester.save();

    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * updateCourseInSemester Controller
 * PUT /api/semesters/:semesterId/courses/:courseId
 * Updates an existing course in a semester
 */
const updateCourseInSemester = async (req, res) => {
  try {
    const { semesterId, courseId } = req.params;

    const semester = await Semester.findById(semesterId);

    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    /**
     * Find the course within the semester's courses array
     * Mongoose provides .id() helper method for finding embedded documents
     * Returns the course document or null if not found
     */
    const course = semester.courses.id(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    /**
     * Update course fields with new values from request body
     * Use || operator to keep existing value if new value not provided
     * This allows partial updates (only some fields can be updated)
     */
    course.courseTitle = req.body.courseTitle || course.courseTitle;
    course.creditUnit = req.body.creditUnit || course.creditUnit;
    course.grade = req.body.grade || course.grade;

    /**
     * Save updated semester back to database
     * This persists the course changes to MongoDB
     */
    await semester.save();

    res.status(200).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * deleteCourseFromSemester Controller
 * DELETE /api/semesters/:semesterId/courses/:courseId
 * Deletes a course from a semester
 */
const deleteCourseFromSemester = async (req, res) => {
  try {
    /**
     * Extract IDs from URL parameters
     * semesterId: the semester containing the course
     * courseId: the course to delete
     */
    const { semesterId, courseId } = req.params;

    /**
     * Find the semester by MongoDB _id
     * If not found, findById returns null
     */
    const semester = await Semester.findById(semesterId);

    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    /**
     * Remove the course from semester's courses array
     * .filter() creates a new array excluding the matching course
     * Keeps all courses EXCEPT where _id matches the courseId
     * Convert .toString() because MongoDB ObjectIds need string comparison
     */
    semester.courses = semester.courses.filter(
      (course) => course._id.toString() !== courseId,
    );

    await semester.save();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSemesters,
  createSemester,
  addCourseToSemester,
  updateCourseInSemester,
  deleteCourseFromSemester,
};
