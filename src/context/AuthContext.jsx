// src/contexts/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await loginUser(email, password);

    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    return { success: true };
  };

  const register = async (userData) => {
    const result = registerUser(userData);
    if (result.success) {
      // Don't automatically log in the new user
      // Let them go through the login flow
    }
    return result;
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    updateUserState,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
