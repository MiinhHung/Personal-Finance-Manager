/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'pf_token';
const USER_KEY = 'pf_user';

// Đọc trạng thái auth ban đầu từ localStorage (chỉ gọi một lần)
const readInitialAuthState = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  const savedToken = localStorage.getItem(TOKEN_KEY);
  const savedUser = localStorage.getItem(USER_KEY);

  if (!savedToken || !savedUser) {
    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(savedUser);
    return { token: savedToken, user };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const initial = readInitialAuthState();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);

  const saveAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const { token: t, user: u } = res.data.data;
    saveAuth(t, u);
    return u;
  };

  const register = async ({ fullName, email, password }) => {
    const res = await authApi.register({ fullName, email, password });
    const { token: t, user: u } = res.data.data;
    saveAuth(t, u);
    return u;
  };

  const logout = () => {
    clearAuth();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}