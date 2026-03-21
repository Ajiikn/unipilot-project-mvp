/**
 * Grading Scales Object - Defines how letter grades convert to points on different scales
 * 5.0 Scale: Commonly used in Nigerian universities
 * 4.0 Scale: Commonly used in US universities
 */
const gradingScales = {
  // 5.0 GPA Scale
  5: {
    name: "5.0 Scale",
    grades: {
      A: 5, // A grade = 5.0 points
      B: 4, // B grade = 4.0 points
      C: 3, // C grade = 3.0 points
      D: 2, // D grade = 2.0 points
      E: 1, // E grade = 1.0 points
      F: 0, // F grade = 0.0 points (fail)
    },
  },
  // 4.0 GPA Scale
  4: {
    name: "4.0 Scale",
    grades: {
      A: 4, // A grade = 4.0 points
      B: 3, // B grade = 3.0 points
      C: 2, // C grade = 2.0 points
      D: 1, // D grade = 1.0 points
      F: 0, // F grade = 0.0 points (fail)
    },
  },
};

/**
 * gradeToPoint Function - Converts a letter grade to numerical points
 */
export function gradeToPoint(grade, scale = 5) {
  // Look up the grade in the selected scale, return the point value
  // The ?. operator safely accesses nested objects (returns undefined if not found)
  // If grade not found, return 0 as fallback
  return gradingScales[scale]?.grades[grade] || 0;
}

/**
 * getClassification Function - Determines academic classification based on CGPA
 * Converts a numerical CGPA into a text classification (e.g., "First Class")
 */
export function getClassification(cgpa, scale = 5) {
  // Check scale to determine which thresholds to use
  if (scale === 5) {
    // 5.0 Scale classifications
    if (cgpa >= 4.5) return "First Class"; // Excellent performance
    if (cgpa >= 3.5) return "Second Class Upper"; // Very good performance
    if (cgpa >= 2.5) return "Second Class Lower"; // Good performance
    if (cgpa >= 1.5) return "Third Class"; // Acceptable performance
    if (cgpa >= 1.0) return "Pass"; // Minimum passing grade
    return "Fail"; // Below passing
  } else {
    // 4.0 Scale classifications
    if (cgpa >= 3.5) return "First Class"; // Excellent performance
    if (cgpa >= 3.0) return "Second Class Upper"; // Very good performance
    if (cgpa >= 2.0) return "Second Class Lower"; // Good performance
    if (cgpa >= 1.0) return "Third Class"; // Acceptable performance
    if (cgpa >= 0.5) return "Pass"; // Minimum passing grade
    return "Fail"; // Below passing
  }
}

/**
 * getMinGPAForClassification Function - Returns the minimum GPA required for a target classification
 * Used to show users what GPA they need to achieve their academic goals
 */
export function getMinGPAForClassification(classification, scale = 5) {
  const thresholds = {
    5: {
      "First Class": 4.5,
      "Second Class Upper": 3.5,
      "Second Class Lower": 2.5,
      "Third Class": 1.5,
      Pass: 1.0,
      Fail: 0,
    },
    4: {
      "First Class": 3.5,
      "Second Class Upper": 3.0,
      "Second Class Lower": 2.0,
      "Third Class": 1.0,
      Pass: 0.5,
      Fail: 0,
    },
  };

  // Return the minimum GPA for the requested classification and scale
  // The ?. operator safely returns 0 if scale or classification doesn't exist
  return thresholds[scale]?.[classification] || 0;
}

/**
 * getClassifications Function - Returns all available classifications for a given scale
 */
export function getClassifications(scale = 5) {
  // Define all classifications for both scales
  const thresholds = {
    5: {
      "First Class": 4.5,
      "Second Class Upper": 3.5,
      "Second Class Lower": 2.5,
      "Third Class": 1.5,
      Pass: 1.0,
      Fail: 0,
    },
    4: {
      "First Class": 3.5,
      "Second Class Upper": 3.0,
      "Second Class Lower": 2.0,
      "Third Class": 1.0,
      Pass: 0.5,
      Fail: 0,
    },
  };

  return Object.keys(thresholds[scale] || ["No classifications available"]);
}
