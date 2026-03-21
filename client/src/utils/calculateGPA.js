import { gradeToPoint } from "./gradeToPoint";

/**
 * calculateGPA Function - Calculates Grade Point Average for a single semester
 * Formula: GPA = Σ(Grade Points × Credit Units) / Σ(Credit Units)
 */
export function calculateGPA(courses, scale = 5) {
  // Guard clause: Return 0 if no courses exist (empty semester)
  if (courses.length === 0) return 0;

  // Variable to accumulate total grade points (grade point × credit units)
  let Points = 0;

  // Variable to accumulate total credit units
  let Credits = 0;

  // Loop through each course in the semester
  courses.forEach((course) => {
    // Convert letter grade (A, B, C, etc.) to numerical value (5, 4, 3, etc.)
    const gradePoint = gradeToPoint(course.grade, scale);

    // Get the credit units for this course
    const credit = course.creditUnit;

    // Add weighted grade point (grade point × credit) to running total
    Points += gradePoint * credit;

    // Add credit units to running total
    Credits += credit;
  });

  // Calculate and return GPA: total points divided by total credits
  // Safety check: if Credits is 0, return 0 to avoid NaN (Not a Number)
  return Credits > 0 ? Points / Credits : 0;
}
