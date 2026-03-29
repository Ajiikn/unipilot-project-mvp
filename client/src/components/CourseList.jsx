import { useState } from "react";
import { cleanCourse } from "../utils/cleanCourse";

// Helper function to get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function CourseList({
  semester, // The semester object with courses array
  semesters, // All semesters array for reference
  setSemesters, // Function to update semesters state
  semesterIndex, // Index of this semester in the semesters array
}) {
  /**
   * State to track which course is in edit mode (if any)
   * null means no course is being edited
   * A number means that's the index of the course being edited
   */
  const [editSemesterIndex, setEditSemesterIndex] = useState(null);
  const [editCourseIndex, setEditCourseIndex] = useState(null);

  /**
   * Temporary state for storing edited course data while in edit mode
   */
  const [tempCourse, setTempCourse] = useState({
    courseTitle: "",
    creditUnit: "",
    grade: "",
  });

  /**
   * deleteCourse Function - Removes a course from a semester
   * Makes DELETE request to backend, then refetches all semesters
   */
  const deleteCourse = async (semesterIndex, courseId) => {
    try {
      // Get the MongoDB ID of the semester
      const semesterId = semesters[semesterIndex]._id;

      // Make DELETE request to backend API
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/semesters/${semesterId}/courses/${courseId}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        },
      );

      /**
       * After successful deletion, refetch all semesters to ensure consistency
       * Backend returns updated data, update React state
       */
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/semesters`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setSemesters(data.slice(0, 2));
      setSemesters(data); // Update state with fresh data from backend
    } catch (error) {
      console.log(error); // Log error but silently fail (UX could be improved)
    }
  };

  /**
   * handleEdit Function - Puts a course into edit mode
   * Stores the course data in tempCourse state
   */
  const handleEdit = (semesterIndex, courseIndex) => {
    // Set which semester and course are being edited
    setEditSemesterIndex(semesterIndex);
    setEditCourseIndex(courseIndex);

    // Copy the current course data into tempCourse for editing
    // This allows user to change fields and preview before saving
    setTempCourse(semesters[semesterIndex].courses[courseIndex]);
  };

  /**
   * handleSave Function - Saves edited course data to backend
   * Makes PUT request with updated course data
   * Refetches all semesters after successful save
   */
  const handleSave = async () => {
    try {
      // Get IDs needed for the API endpoint
      const semesterId = semesters[editSemesterIndex]._id;
      const courseId =
        semesters[editSemesterIndex].courses[editCourseIndex]._id;

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/semesters/${semesterId}/courses/${courseId}`,
        {
          method: "PUT",
          headers: getAuthHeader(),
          body: JSON.stringify(cleanCourse(tempCourse)), // Clean and send updated data
        },
      );

      /**
       * After successful update, refetch all semesters from backend
       * Ensures data is consistent and up-to-date
       */
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/semesters`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      setSemesters(data.slice(0, 2));

      /**
       * Clear edit mode and reset tempCourse
       * This exits edit mode and returns to normal view
       */
      setEditSemesterIndex(null);
      setEditCourseIndex(null);
      setTempCourse({
        courseTitle: "",
        creditUnit: "",
        grade: "",
      });
    } catch (error) {
      console.log(error); // Log error but silently fail
    }
  };

  const handleCancel = () => {
    setEditSemesterIndex(null);
    setEditCourseIndex(null);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">{semester.name}</h3>

      {/* ========== DESKTOP TABLE VIEW (hidden on mobile) ========== */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-100 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Course</th>{" "}
              <th className="px-6 py-3 text-left">Unit</th>{" "}
              <th className="px-6 py-3 text-left">Grade</th>{" "}
              <th className="px-6 py-3 text-left">Actions</th>{" "}
            </tr>
          </thead>

          <tbody className="divide-y">
            {semester.courses.map((course, courseIndex) =>
              /**
               * Check if THIS course is in edit mode
               * If yes, show edit inputs; otherwise show read-only view
               */
              editSemesterIndex === semesterIndex &&
              editCourseIndex === courseIndex ? (
                /**
                 * EDIT MODE ROW - Shows input fields instead of static text
                 */
                <tr key={course._id}>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={tempCourse.courseTitle}
                      onChange={(e) =>
                        setTempCourse({
                          ...tempCourse,
                          courseTitle: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>

                  <td className="px-6 py-3">
                    <select
                      value={tempCourse.creditUnit}
                      onChange={(e) =>
                        setTempCourse({
                          ...tempCourse,
                          creditUnit: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1"
                    >
                      {[1, 2, 3, 4, 5, 6].map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-3">
                    <select
                      value={tempCourse.grade}
                      onChange={(e) =>
                        setTempCourse({
                          ...tempCourse,
                          grade: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1"
                    >
                      {["A", "B", "C", "D", "E", "F"].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-3 space-x-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                /**
                 * NORMAL VIEW ROW - Shows static course data
                 */
                <tr key={course._id}>
                  <td className="px-6 py-3">{course.courseTitle}</td>

                  <td className="px-6 py-3">{course.creditUnit}</td>

                  <td className="px-6 py-3">{course.grade}</td>

                  <td className="px-6 py-3 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(semesterIndex, courseIndex)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCourse(semesterIndex, course._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* ========== MOBILE CARD VIEW (hidden on desktop) ========== */}
      <div className="md:hidden space-y-4">
        {/* Map through courses and display each as a card */}
        {semester.courses.map((course, courseIndex) =>
          /**
           * Check if THIS course is in edit mode on mobile
           * If yes, show edit card; otherwise show read-only card
           */
          editSemesterIndex === semesterIndex &&
          editCourseIndex === courseIndex ? (
            /**
             * EDIT MODE CARD - Shows input fields for editing course
             */
            <div key={course._id} className="bg-white p-4 rounded shadow">
              <input
                type="text"
                value={tempCourse.courseTitle}
                onChange={(e) =>
                  setTempCourse({
                    ...tempCourse,
                    courseTitle: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 w-full mb-2"
              />

              <select
                value={tempCourse.creditUnit}
                onChange={(e) =>
                  setTempCourse({
                    ...tempCourse,
                    creditUnit: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 w-full mb-2"
              >
                {[1, 2, 3, 4, 5, 6].map((u) => (
                  <option key={u} value={u}>
                    {u} Unit
                  </option>
                ))}
              </select>

              <select
                value={tempCourse.grade}
                onChange={(e) =>
                  setTempCourse({
                    ...tempCourse,
                    grade: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 w-full mb-3"
              >
                {["A", "B", "C", "D", "E", "F"].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-500 text-white px-3 py-1 rounded w-full"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-3 py-1 rounded w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /**
             * NORMAL VIEW CARD - Shows static course data
             */
            <div key={course._id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{course.courseTitle}</p>

              <p className="text-sm text-gray-600">Unit: {course.creditUnit}</p>

              <p className="text-sm text-gray-600">Grade: {course.grade}</p>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleEdit(semesterIndex, courseIndex)}
                  className="bg-blue-500 text-white px-3 py-1 rounded w-full"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteCourse(semesterIndex, course._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
