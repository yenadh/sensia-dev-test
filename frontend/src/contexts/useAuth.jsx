// src/contexts/useAuth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  authenticated_user,
  login,
  logout,
  getPermissionById,
} from "@/endpoints/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const nav = useNavigate();

  const fetchPermissions = async () => {
    try {
      const res = await getPermissionById();
      if (res.admin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        const allowedPages = res.data
          .filter((permission) => permission.can_comment === true)
          .map((permission) => permission.page);
        setPermissions(allowedPages);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setIsAdmin(false);
      setPermissions([]);
    }
  };

  const get_authenticated_user = async () => {
    try {
      const user = await authenticated_user();
      setUser(user);
      await fetchPermissions();
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (username, password) => {
    const user = await login(username, password);
    if (user) {
      setUser(user);
      await fetchPermissions();
      nav("/");
    } else {
      alert("Incorrect username or password");
    }
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    setIsAdmin(false);
    setPermissions([]);
    nav("/login");
  };

  useEffect(() => {
    get_authenticated_user();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        permissions,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
