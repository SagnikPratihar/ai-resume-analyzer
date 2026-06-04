import { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/auth.service.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const { data } = await authService.getMe();
          setUser(data.user);
        } catch {
          authService.removeToken();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback((userData, token) => {
    authService.saveToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authService.removeToken();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
