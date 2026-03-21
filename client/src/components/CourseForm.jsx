import { useState } from "react";
import { cleanCourse } from "../utils/cleanCourse";

export default function CourseForm({ addCourse, semesters }) {
  const [course, setCourse] = useState({
    courseTitle: "",
    creditUnit: "",
    grade: "",
  });

  const [semesterIndex, setSemesterIndex] = useState(0);
  /**
   * handleChange Function - Updates course state when user types in input fields
   * Called when user changes any input field (courseTitle, creditUnit, grade)
   */
  const handleChange = (e) => {
    // Get the new value from the form input
    let value = e.target.value;

    // Update course state:
    // ...course spreads existing properties (copies them)
    // [e.target.name] dynamically updates the field that changed
    // e.target.name is the 'name' attribute of the input (courseTitle, creditUnit, or grade)
    setCourse({ ...course, [e.target.name]: value });
  };

  /**
   * handleSubmit Function - Validates and submits the form
   * Called when user clicks "Add Course" button
   */
  const handleSubmit = async (e) => {
    // Prevent browser's default form submission (page reload)
    e.preventDefault();

    // Validation Check 1: Ensure at least one semester exists
    if (semesters.length === 0) {
      alert("Create at least one semester before adding courses.");
      return; // Stop execution, don't continue
    }

    /**
     * Validation Check 2: Ensure all form fields are filled
     * If ANY field is empty (""), show error and stop
     */
    if (!course.courseTitle || !course.creditUnit || !course.grade) {
      alert("Please fill in all fields!");
      return; // Stop execution
    }

    /**
     * Clean the course data before sending to backend
     * cleanCourse: uppercases title, removes special chars, converts unit to number
     */
    const cleanedCourse = cleanCourse(course);

    /**
     * Validation Check 3: Prevent duplicate course titles in same semester
     * Check if a course with same title already exists in the selected semester
     */
    const existingCourse = semesters[semesterIndex]?.courses.some(
      (c) =>
        // Compare titles case-insensitively (both uppercase for comparison)
        c.courseTitle.toUpperCase() === cleanedCourse.courseTitle.toUpperCase(),
    );

    // If duplicate found, show error and stop
    if (existingCourse) {
      alert("Course title already exists in this semester.");
      return;
    }

    /**
     * All validations passed!
     * await waits for the add operation to complete (might be API call)
     */
    await addCourse(cleanedCourse, semesterIndex);

    /**
     * Success! Reset the form fields to empty
     * This clears the inputs so user can add another course
     */
    setCourse({ courseTitle: "", creditUnit: "", grade: "" });
  };

  const isFormValid = course.courseTitle && course.creditUnit && course.grade;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Semester:
          </label>

          <select
            id="semester"
            value={semesterIndex}
            onChange={(e) => setSemesterIndex(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={semesters.length === 0}
          >
            {semesters.length === 0 ? (
              <option value="">No semesters available</option>
            ) : (
              semesters.map((sem, index) => (
                <option key={sem._id || index} value={index}>
                  {sem.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="courseTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Code:
          </label>

          <input
            type="text"
            name="courseTitle"
            value={course.courseTitle}
            onChange={handleChange}
            id="courseTitle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="creditUnit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Unit:
          </label>

          <select
            name="creditUnit"
            value={course.creditUnit}
            onChange={handleChange}
            id="creditUnit"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value=""> -- Select Course Unit -- </option>

            {[1, 2, 3, 4, 5, 6].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="grade"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Grade:
          </label>

          <select
            name="grade"
            value={course.grade}
            onChange={handleChange}
            id="grade"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value=""> --Select Grade-- </option>

            {["A", "B", "C", "D", "E", "F"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={!isFormValid}
          className={`w-full py-2 px-4 rounded-md ${
            isFormValid
              ? "bg-blue-600 text-white"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Add Course
        </button>
      </form>
    </>
  );
}
