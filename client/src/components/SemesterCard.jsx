// Import GPA calculation utility function
import { calculateGPA } from "../utils/calculateGPA";
// Import function to convert CGPA to classification text
import { getClassification } from "../utils/gradeToPoint";
// Import CourseList component to display courses in this semester
import CourseList from "./CourseList";

/**
 * SemesterCard Component - Displays a single semester with its GPA and courses
 * Shows semester name, GPA, classification, and list of courses with edit/delete buttons
 */
export default function SemesterCard({
  semester, // The semester object containing name and courses array
  semesterIndex, // Index of this semester in the semesters array (0 or 1)
  semesters, // All semesters (whole array)
  setSemesters, // Function to update semesters array
  scale, // Current GPA scale (4.0 or 5.0)
}) {
  /**
   * Calculate this semester's GPA
   * calculateGPA takes courses array and scale, returns a number
   */
  const gpa = calculateGPA(semester.courses, scale);

  /**
   * Get the classification text for this semester's GPA
   * (e.g., "First Class", "Pass", etc.)
   */
  const classification = getClassification(gpa, scale);

  return (
    // Card container with white background, rounded corners, shadow
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Semester name heading (e.g., "Semester 1") */}
      <h3 className="text-lg font-semibold mb-4">{semester.name}</h3>

      {/* GPA Display Section - centered with larger text */}
      <div className="mb-4 text-center">
        {/* Large bold GPA number (e.g., "4.25") */}
        <div className="text-2xl font-bold text-blue-600">
          {/* .toFixed(2) rounds GPA to 2 decimal places */}
          {gpa.toFixed(2)}
        </div>

        {/* Label under the GPA */}
        <div className="text-sm text-gray-600">GPA</div>

        {/* Classification label (e.g., "First Class") */}
        <div className="text-md font-semibold text-gray-800 mt-1">
          {classification}
        </div>
      </div>

      {/* Conditional rendering: Show message if no courses, otherwise show course list */}
      {semester.courses.length === 0 ? (
        // No courses added yet - show message
        <p className="text-gray-500 text-sm">No courses added yet.</p>
      ) : (
        // Show the CourseList component with table/cards of courses
        <CourseList
          semester={semester} // Pass semester data
          semesterIndex={semesterIndex} // Pass semester index for identifying in parent
          semesters={semesters} // Pass all semesters for reference
          setSemesters={setSemesters} // Pass setter for updating semesters
        />
      )}
    </div>
  );
}
