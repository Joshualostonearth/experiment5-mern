import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const data = await authAPI.getMe();
        if (isMounted && data.user) {
          setUser(data.user);
        }
      } catch {
        // Not authenticated or session expired — normal state for visitors
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  async function login(email, password) {
    const data = await authAPI.login({ email, password });
    setUser(data.user);
    return data.user;
  }

  async function register(userData) {
    const data = await authAPI.register(userData);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      setUser(null);
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

