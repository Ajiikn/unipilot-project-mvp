import { createContext, useContext, useState, useEffect } from "react";

// Create the auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Auth provider component
export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = (newUsername) => {
    setUsername(newUsername);
    setToken(localStorage.getItem("authToken"));
  };

  // Logout function
  const logout = () => {
    setUsername(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  };

  const value = {
    username,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
