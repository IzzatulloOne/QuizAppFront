import api from './axiosInstance';
import type { MyTest, TestFullResponseDto } from './types';

export const getMyTests = async (): Promise<MyTest[]> => {
  const { data } = await api.get<MyTest[]>('/api/my-tests');
  return data;
};


export const updateTest = async (test_id: string, name: string): Promise<MyTest> => {
  const { data } = await api.patch<MyTest>(`/api/tests/${test_id}/`, {nomi : name});
  return data;
};


export const createTest = async (payload: any): Promise<TestFullResponseDto> => {
  const { data } = await api.post<TestFullResponseDto>(`/api/tests/`, payload);
  return data;
};


export const deleteTest = async (test_id: string): Promise<void> => {
  await api.delete<void>(`/api/tests/${test_id}/`);
};
