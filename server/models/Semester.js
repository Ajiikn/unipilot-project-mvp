const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  name: { type: String, required: true },

  courses: [
    {
      courseTitle: { type: String, required: true },

      creditUnit: { type: Number, required: true },

      grade: { type: String, required: true },
    },
  ],
});

/**
 * Create Semester Model from Schema
 * This creates a collection named "semesters" in MongoDB
 * The model provides methods to query, create, update, and delete semesters
 */
const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;
