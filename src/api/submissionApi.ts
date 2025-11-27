import api from './axiosInstance';
import type { TestSubmission, TestSubmissionDetails } from './types';


export const createSubmission = async (test_id: string, payload: any): Promise<TestSubmission> => {
  const { data } = await api.post<TestSubmission>(`/api/tests/${test_id}/submission`, payload);
  return data;
};

export const getMySubmissions = async (): Promise<TestSubmission[]> => {
  const { data } = await api.get<TestSubmission[]>('/api/my-submissions');
  return data;
};


export const getSubmissioDetails = async (submission_id: string): Promise<TestSubmissionDetails> => {
  const { data } = await api.get<TestSubmissionDetails>(`/api/submissions/${submission_id}`);
  return data;
};