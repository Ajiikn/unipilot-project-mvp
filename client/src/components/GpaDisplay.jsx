import { calculateCGPA } from "../utils/calculateCGPA";
import {
  getClassification,
  getMinGPAForClassification,
  getClassifications,
} from "../utils/gradeToPoint";
import ScaleSelector from "./ScaleSelector";

/**
 * GpaDisplay Component - Shows overall CGPA and progress toward academic goals
 * Displays: Current CGPA, Classification, Target classification, and progress bar
 */
export default function GpaDisplay({
  semesters, // All semesters to calculate CGPA from
  scale, // Current GPA scale (4.0 or 5.0)
  setScale, // Function to change scale
  targetClassification, // User's academic goal (e.g., "First Class")
  setTargetClassification, // Function to change academic goal
}) {
  /**
   * Calculate the overall CGPA across all semesters
   */
  const cgpa = calculateCGPA(semesters, scale);

  /**
   * Get the classification text for the current CGPA
   * Maps numerical CGPA to text (e.g., 4.0 → "First Class")
   */
  const classification = getClassification(cgpa, scale);

  /**
   * Get the minimum GPA needed to achieve the target classification
   * Example: if target is "Second Class Upper", this gets 3.5
   */
  const targetGPA = getMinGPAForClassification(targetClassification, scale);

  /**
   * Calculate progress percentage toward the target
   * Formula: (currentCGPA / targetCGPA) * 100
   * Math.min caps it at 100% so it doesn't exceed 100
   */
  const progress = Math.min((cgpa / targetGPA) * 100, 100);

  /**
   * Boolean to check if target is achieved
   * True if current CGPA >= target CGPA
   */
  const isAchieved = cgpa >= targetGPA;

  /**
   * Get list of all available classifications for the current scale
   * Used to populate the target classification dropdown
   */
  const classifications = getClassifications(scale);

  return (
    // Main container with white background, rounded corners, shadow
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
      {/* Flex container for responsive layout - stacks on mobile, horizontal on desktop */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* SECTION 1: Current CGPA Display */}
        <div className="flex flex-col items-center text-center">
          {/* Large CGPA number (rounded to 2 decimal places) */}
          <div className="text-4xl md:text-5xl font-extrabold text-blue-600 tracking-tight">
            {/* .toFixed(2) ensures we see exactly 2 decimal places (e.g., 4.25) */}
            {cgpa.toFixed(2)}
          </div>

          {/* "CGPA" label below the number */}
          <p className="text-sm uppercase tracking-wide text-gray-500 mt-1">
            CGPA
          </p>

          {/* Classification badge (e.g., "First Class") */}
          <div className="mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            {classification}
          </div>
        </div>

        {/* Divider line (hidden on mobile, visible on desktop) */}
        <div className="hidden md:block h-12 w-px bg-gray-200"></div>

        {/* SECTION 2: Target Classification Section */}
        <div className="flex flex-col items-center text-center">
          {/* Label for the target selector */}
          <label
            htmlFor="target"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            Target Classification
          </label>

          {/* Dropdown to select target classification */}
          <select
            id="target"
            value={targetClassification} // Currently selected target
            // When user selects new target, update parent state
            onChange={(e) => setTargetClassification(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            {/* Map all available classifications to option elements */}
            {classifications.map((cls) => (
              <option key={cls} value={cls}>
                {/* Display classification name and required GPA threshold */}
                {cls} ({getMinGPAForClassification(cls, scale)}+)
              </option>
            ))}
          </select>

          {/* Target GPA threshold text */}
          <div className="mt-2 text-xs text-gray-500">
            Target GPA: {targetGPA.toFixed(1)}
          </div>

          {/* Progress bar toward target */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            {/* Inner bar fill grows as progress increases */}
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isAchieved ? "bg-green-500" : "bg-blue-500" // Green if achieved, blue if not
              }`}
              // Width is the progress percentage (0-100%)
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Progress text - shows achievement message or points needed */}
          <div className="mt-1 text-xs text-gray-600">
            {
              isAchieved
                ? "🎉 Target Achieved!" // Celebration if goal met
                : `${(targetGPA - cgpa).toFixed(2)} to go` // Show how many points needed
            }
          </div>
        </div>

        {/* Divider line (hidden on mobile, visible on desktop) */}
        <div className="hidden md:block h-12 w-px bg-gray-200"></div>

        {/* SECTION 3: Grading Scale Selector */}
        <div className="flex flex-col items-center md:items-end gap-2">
          {/* ScaleSelector component - allows switching between 4.0 and 5.0 scales */}
          <ScaleSelector scale={scale} setScale={setScale} />
        </div>
      </div>
    </div>
  );
}
