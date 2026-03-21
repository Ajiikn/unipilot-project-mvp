import { gradeToPoint } from "./gradeToPoint";

/**
 * calculateCGPA Function - Calculates Cumulative Grade Point Average across ALL semesters
 * Formula: CGPA = Σ(Grade Points × Credit Units) for ALL COURSES / Σ(Credit Units) for ALL COURSES
 * This gives the overall academic performance across all semesters combined
 
 */
export function calculateCGPA(semesters, scale = 5) {
  // Flatten all courses from all semesters into a single array
  // flatMap is like map + flatten: [sem1.courses, sem2.courses] → [course1, course2, course3, ...]
  const allCourses = semesters.flatMap((sem) => sem.courses);

  // Guard clause: Return 0 if no courses exist across any semester
  if (allCourses.length === 0) return 0;

  // Variable to accumulate total grade points across ALL semesters
  let totalPoints = 0;

  // Variable to accumulate total credit units across ALL semesters
  let totalCredits = 0;

  // Loop through every course from every semester
  allCourses.forEach((course) => {
    // Convert the grade letter to a point value (A→5, B→4, etc.)
    const gradePoint = gradeToPoint(course.grade, scale);

    // Get the credit units for this course
    const credit = course.creditUnit;

    // Add this course's weighted points to the running total
    totalPoints += gradePoint * credit;

    // Add this course's credits to the running total
    totalCredits += credit;
  });

  // Calculate CGPA: total points divided by total credits across all semesters
  // Safety check: if totalCredits is 0, return 0 to avoid NaN
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}
