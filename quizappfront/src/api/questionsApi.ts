import api from './axiosInstance';
import type { Question } from './types';

export const getTestQuestions = async (id: string): Promise<Question[]> => {
  const { data } = await api.get<Question[]>(`/api/tests/${id}/questions`);
  return data;
};


export const updateQuestion = async (question_id: string, payload: any): Promise<Question> => {
  const { data } = await api.put<Question>(`/api/questions/${question_id}`, payload);
  return data;
};


export const createQuestion = async (test_id: string, payload: any): Promise<Question> => {
  const { data } = await api.post<Question>(`/api/tests/${test_id}/questions`, payload);
  return data;
};


export const deleteQuestion = async (question_id: string): Promise<void> => {
  await api.delete<void>(`/api/questions/${question_id}`);
};