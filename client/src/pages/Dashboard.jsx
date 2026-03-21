import { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/localstorage";
import CourseForm from "../components/CourseForm";
import GpaDisplay from "../components/GpaDisplay";
import SemesterCard from "../components/SemesterCard";

export default function Dashboard() {
  /**
   * Grading scale state - persisted to localStorage so it's remembered between sessions
   * Defaults to 5.0 scale if not previously set
   */
  const [scale, setScale] = useLocalStorage("cgpa-scale", 5);

  /**
   * Target classification state - persisted to localStorage
   * Stores user's academic goal (e.g., "First Class", "Second Class Upper")
   * Defaults to "First Class" if not previously set
   */
  const [targetClassification, setTargetClassification] = useLocalStorage(
    "cgpa-target",
    "First Class",
  );

  /**
   * Semesters state - array of semester objects from MongoDB
   * Starts empty, then populated by fetchSemesters on component mount
   * Each semester contains: name, courses array, and _id from MongoDB
   */
  const [semesters, setSemesters] = useState([]);

  const MAX_SEMESTERS = 2;

  /**
   * createSemester Function - Creates a new semester and saves to MongoDB
   */
  const createSemester = async (name) => {
    // Check if we've already reached maximum semesters (2)
    if (semesters.length >= MAX_SEMESTERS) {
      return null; // Don't create if already at max
    }

    try {
      // Make POST request to backend to create semester
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/semesters`, {
        method: "POST", // POST = create new resource
        headers: { "Content-Type": "application/json" }, // Tell server we're sending JSON
        body: JSON.stringify({ name, courses: [] }), // Send semester name and empty courses array
      });

      // Check if HTTP status is not OK (2xx success codes)
      if (!res.ok) throw new Error(`API error ${res.status}`);

      // Parse response as JSON and return the created semester object with MongoDB _id
      return res.json();
    } catch (err) {
      // If API fails (server down), create a local semester with temporary ID
      console.warn("API offline or semantic error; using local fallback", err);
      return {
        _id: `${Date.now()}-${Math.random()}`, // Temporary ID format: timestamp-random
        name,
        courses: [],
      };
    }
  };

  /**
   * useEffect Hook - Runs ONCE when component first mounts (loads)
   * Fetches all semesters from MongoDB, or creates defaults if none exist
   * Empty dependency array [] means this runs only once on mount
   */
  useEffect(() => {
    /**
     * fetchSemesters Async Function - Gets semesters from the backend
     */
    const fetchSemesters = async () => {
      try {
        // Make GET request to fetch all semesters from MongoDB
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/semesters`,
        );
        const data = await res.json(); // Parse response as JSON array

        /**
         * If no semesters exist yet in database, create 2 default semesters
         * This happens on first app use
         */
        if (!data || data.length === 0) {
          // Use Promise.all to run BOTH create calls in parallel (simultaneously)
          // This is faster than running them sequentially
          const created = await Promise.all([
            createSemester("Semester 1"), // Create first semester
            createSemester("Semester 2"), // Create second semester (runs at same time)
          ]);

          // Filter out any null values (if createSemester failed)
          // .filter(Boolean) keeps only truthy values
          setSemesters(created.filter(Boolean));
          return; // Exit early, don't continue
        }

        /**
         * If semesters already exist, use them
         * .slice(0, MAX_SEMESTERS) keeps only first 2 semesters
         * This ensures we never have more than 2 semesters displayed
         */
        setSemesters(data.slice(0, MAX_SEMESTERS));
      } catch (error) {
        /**
         * If API call fails (backend server is down)
         */
        console.log(error);

        /**
         * Create default local semesters so app still works offline
         * These have special "local-" IDs so we know they're not from MongoDB
         */
        const localDefault = [
          { _id: "local-1", name: "Semester 1", courses: [] },
          { _id: "local-2", name: "Semester 2", courses: [] },
        ];
        setSemesters(localDefault); // Use local data as fallback
      }
    };

    // Call the fetchSemesters function when component mounts
    fetchSemesters();
  }, []); // Empty array = run only once on mount

  /**
   * addCourse Function - Adds a new course to a semester
   * First tries to add via backend API, falls back to local state if API fails
   *
   * @param {Object} newCourse - Course object with courseTitle, creditUnit, grade
   * @param {Number} semesterIndex - Index of which semester to add course to
   */
  const addCourse = async (newCourse, semesterIndex) => {
    try {
      // Get the MongoDB ID of the semester from state
      const semesterId = semesters[semesterIndex]._id;

      // Make POST request to add course to this semester
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/semesters/${semesterId}/courses`, // endpoint includes semester ID
        {
          method: "POST", // POST = create new resource
          headers: {
            "Content-Type": "application/json", // Sending JSON data
          },
          body: JSON.stringify(newCourse), // Convert course object to JSON string
        },
      );

      /**
       * Handle 409 Conflict response - course already exists
       * Don't throw error, just show user a friendly alert
       */
      if (res.status === 409) {
        const body = await res.json();
        alert(body.message || "Duplicate course");
        return; // Stop execution, don't update state
      }

      // If any other error status, throw error to be caught below
      if (!res.ok) throw new Error(`API error ${res.status}`);

      // Parse the response - backend sends back the updated semester object
      const updatedSemester = await res.json();

      /**
       * Update React state with the new semester data
       * .map() goes through each semester and:
       * - If it's the one we updated (matching index), replace it with updatedSemester
       * - Otherwise, return it unchanged
       */
      setSemesters((prev) =>
        prev.map((sem, index) =>
          index === semesterIndex ? updatedSemester : sem,
        ),
      );
    } catch (error) {
      /**
       * If API call fails, add course locally (offline fallback)
       * This keeps the app usable even if backend is down
       */
      console.warn("Course API failed, applying locally", error);

      // Update state to add course locally
      setSemesters((prev) =>
        prev.map((sem, index) => {
          // Only modify the semester we're adding to
          if (index !== semesterIndex) return sem;

          // Return modified semester with new course added
          return {
            ...sem, // Keep all existing semester properties
            courses: [
              ...sem.courses, // Spread existing courses into new array
              {
                ...newCourse, // Add the new course
                _id: `${Date.now()}-${Math.random()}`, // Give it a temporary local ID
              },
            ],
          };
        }),
      );
    }
  };

  /**
   * RETURN/RENDER - JSX markup for the Dashboard component
   * Displays: GPA Display, Course Form, Add Semester Button, and Semester Cards
   */
  return (
    // Main container div with gap between sections (space-y-8 = 8 units of space between child elements)
    <div className="space-y-8">
      {/* 1. GPA Display Section - Shows overall CGPA, classification, target goals */}
      <GpaDisplay
        semesters={semesters} // Pass all semesters for CGPA calculation
        scale={scale} // Pass current GPA scale
        setScale={setScale} // Pass setter to allow scale change
        targetClassification={targetClassification} // Pass user's academic goal
        setTargetClassification={setTargetClassification} // Pass setter for updating goal
      />

      {/* 2. Add Course Section - Form to add new courses to semesters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Section title */}
        <h2 className="text-xl font-semibold mb-4">Add New Course</h2>

        {/* CourseForm component - contains inputs for course details */}
        <CourseForm
          addCourse={addCourse} // Pass function to handle course submission
          semesters={semesters} // Pass semesters list for semester dropdown
        />
      </div>

      {/* 3. Add Semester Section - Button and counter for creating new semesters */}
      <div className="flex items-center space-x-3">
        {/* Button to create new semester */}
        <button
          disabled={semesters.length >= MAX_SEMESTERS} // Disable if already at max (2)
          className={`py-2 px-4 rounded ${
            semesters.length >= MAX_SEMESTERS
              ? "bg-gray-400 text-gray-800 cursor-not-allowed" // Disabled style (gray)
              : "bg-blue-600 text-white" // Enabled style (blue)
          }`}
          onClick={async () => {
            // When clicked, create new semester with name "Semester 3" or "Semester 4" etc
            const newSemester = await createSemester(
              `Semester ${semesters.length + 1}`, // Auto-increment semester number
            );

            // If creation succeeded, add to semesters array
            if (newSemester) {
              setSemesters((prev) => [...prev, newSemester]); // Spread existing + add new
            }
          }}
        >
          Add Semester
        </button>

        {/* Text showing how many semesters exist and the limit */}
        <span className="text-sm text-gray-600">
          {semesters.length} semester(s) (max {MAX_SEMESTERS})
        </span>
      </div>

      {/* 4. Semesters Grid - Displays all semesters in 1 or 2 column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Show message if no semesters exist yet */}
        {semesters.length === 0 ? (
          <p className="text-gray-500">No semesters available yet.</p>
        ) : (
          // Otherwise, map through semesters array and display each one
          semesters.map((semester, index) => (
            <SemesterCard
              key={semester._id || index} // Unique key for React list rendering
              semester={semester} // pass semester data
              semesterIndex={index} // Pass index for identifying which semester
              semesters={semesters} // Pass all semesters for reference
              setSemesters={setSemesters} // Pass setter for state updates in child
              scale={scale} // Pass GPA scale for GPA calculation
            />
          ))
        )}
      </div>
    </div>
  );
}
