export default function ScaleSelector({ scale, setScale }) {
  return (
    <div className="mb-4">
      <label htmlFor="scale" className="text-sm font-medium text-gray-700 mr-2">
        Grading Scale:
      </label>

      <select
        id="scale"
        // Current value displayed is the scale state
        value={scale}
        // When user selects a new scale, convert string to number and update state
        onChange={(e) => setScale(Number(e.target.value))}
        // Tailwind styling: padding, border, rounded corners, focus ring (blue glow)
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {/* Option 1: 5.0 scale (common in Nigeria) */}
        <option value={5}>5.0 Scale</option>

        {/* Option 2: 4.0 scale (common in USA) */}
        <option value={4}>4.0 Scale</option>
      </select>
    </div>
  );
}
