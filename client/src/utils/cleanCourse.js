/**
 * cleanCourse Function - Standardizes and validates course data before sending to backend
 * Input: course object with courseTitle, creditUnit, grade
 * Output: cleaned course object with standardized values
 */
export function cleanCourse(course) {
  return {
    // Spread existing course properties first
    ...course,

    // Clean course title: remove whitespace, convert to uppercase, remove special chars
    courseTitle: course.courseTitle
      .trim() // Remove leading/trailing whitespace
      .toUpperCase() // Convert to uppercase (e.g., "CS101" instead of "cs101")
      .replace(/[^a-zA-Z0-9 ]/g, ""), // Remove special characters, keep only letters, numbers, spaces

    // Ensure creditUnit is a number type (converts from string if needed)
    creditUnit: Number(course.creditUnit),

    // Keep grade as-is (validated separately)
    grade: course.grade,
  };
}
