import axios, { AxiosError } from 'axios';
import { Form, FormData, FormSubmission, ParsedFormSubmission } from '@/lib/type';
import { BulkEmailParams } from '@/lib/type';
import { parseFormSubmission } from './utils';

const api = axios.create({
  baseURL: '/api',
});

export const formApi = {
  getForms: async (): Promise<Form[]> => {
    const { data } = await api.get<Form[]>('/forms');
    return data;
  },

  getForm: async (formId: number): Promise<Form> => {
    const { data } = await api.get<{ form: Form }>(`/forms/${formId}`);
    console.log('data', data);
    return data.form;
  },

  createForm: async (message: string, duplicated: boolean = false): Promise<{ id: number }> => {
    const { data } = await api.post<{ id: number }>('/forms', { message, duplicated });
    return data;
  },

  updateForm: async (formId: number, jsonform: FormData): Promise<void> => {
    await api.put(`/forms/${formId}`, { jsonform });
  },

  deleteForm: async (formId: number): Promise<void> => {
    await api.delete(`/forms/${formId}`);
  },

  getTotalStats: async (): Promise<{ submissions: number; visits: number, submissionRate: number, bounceRate: number }> => {
    const { data } = await api.get<{
      submissions: number; visits: number, submissionRate: number, bounceRate: number
    }>('/forms/stats');
    return data;
  },

  getStats: async (formId: number): Promise<{ submissions: number; visits: number }> => {
    const { data } = await api.get<{ submissions: number; visits: number }>(`/forms/${formId}/stats`);
    return data;
  },
};

export const responsesApi = {
  getResponses: async (formId: number): Promise<FormSubmission[]> => {
    const { data } = await api.get<FormSubmission[]>(`/responses?formId=${formId}`);
    return data;
  },

  getResponse: async (responseId: number): Promise<FormSubmission> => {
    const { data } = await api.get<FormSubmission>(`/responses/${responseId}`);
    return data;
  },

  createResponse: async (formId: number, submission: String): Promise<{ id: number }> => {
    const { data } = await api.post<{ id: number }>('/responses', { formId, submission });
    return data;
  },

// Responses to forms can be updated, but this feature is not implemented in the app
//   updateResponse: async (responseId: number, response: any): Promise<void> => {
//     await api.put(`/responses/${responseId}`, { response });
//   },

  deleteResponse: async (responseId: number): Promise<void> => {
    await api.delete(`/responses/${responseId}`);
  },

  getResponsesCount: async (formId: number): Promise<number> => {
    const { data } = await api.get<{ count: number }>(`/responses/count?formId=${formId}`);
    return data.count;
  },
};

export const mailersendApi = {
  sendBulkEmail: async (params: BulkEmailParams): Promise<any> => {
    const { data } = await api.post('/mailersend', params);
    return data;
  },
};
