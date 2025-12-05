import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getAccessToken, setAccessToken, setRefreshToken, clearTokens, setAuthUser, getAuthUser } from '../services/tokenService';
import { loginApi } from '../api/authApi';
import type { User } from '../api/types';
import { registerLogoutCallback } from './authEvents';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = getAccessToken();
    const authUser = getAuthUser();
    
    if (token && authUser) {
      setUser(authUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    registerLogoutCallback(logout);
  }, []);

  const login = async (username: string, password: string) => {
    const { accessToken, refreshToken, user } = await loginApi(username, password);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAuthUser(user);
    setUser(user);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
