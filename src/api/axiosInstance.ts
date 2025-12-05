import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken
} from '../services/tokenService';

import { authLogout } from '../context/authEvents';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { token: refreshToken }
        );

        setAccessToken(data.accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch {
        console.error('Refresh token failed');
        authLogout();   // global logout event
      }
    }

    return Promise.reject(error);
  }
);

export default api;
