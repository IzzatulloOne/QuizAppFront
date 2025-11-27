// src/api/authApi.ts
import api from './axiosInstance';
import type { User } from './types';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/api/auth/login/', { username, password });
  return data;
};

export const getProfileApi = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me');
  return data;
};
