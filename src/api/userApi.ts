import api from './axiosInstance';
import type { User, UserCreateRequest } from './types';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users');
  return data;
};

export const createUser = async (user: UserCreateRequest): Promise<User> => {
  const { data } = await api.post<User>('/users', user);
  return data;
};
