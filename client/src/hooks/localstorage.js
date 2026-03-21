/**
 * Custom Hook: useLocalStorage
 * Provides persistent state management by automatically saving to browser's localStorage
 * Any changes to state are automatically saved and restored on page reload
 *
 * @param {String} key - The key name to store in localStorage
 * @param {*} initialValue - The default value if nothing is stored yet
 * @returns {Array} - [storedValue, setValue] - similar API to useState
 */

// Import React hooks for state management
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  /**
   * Initialize state with a function that runs once on mount
   * This function retrieves the value from localStorage if it exists
   */
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Try to get the item from browser's localStorage using the key
      const item = window.localStorage.getItem(key);

      // If item exists in localStorage, parse it as JSON and return it
      // If item doesn't exist (null), return the initialValue instead
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If parsing JSON fails or any error occurs, log it and return initialValue
      console.log(error);
      return initialValue;
    }
  });

  /**
   * setValue Function - Custom setter that updates both state AND localStorage
   * This replaces the normal useState setter function
   */
  const setValue = (value) => {
    try {
      /**
       * Allow value to be a function (like normal useState)
       * If value is a function, call it with current storedValue to get new value
       * If value is a regular value, use it directly
       */
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Update React state immediately (triggers component re-render)
      setStoredValue(valueToStore);

      // Also save to localStorage as JSON string for persistence
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // If an error occurs during save, log it (in production, might send to error tracking)
      console.log(error);
    }
  };

  // Return array [value, setter] just like useState - makes the API familiar
  return [storedValue, setValue];
}
