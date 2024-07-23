import axios, { AxiosError } from 'axios';
import { Form, FormData, FormResponse } from '@/lib/type';

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
};

export const responsesApi = {
  getResponses: async (formId: number): Promise<FormResponse[]> => {
    const { data } = await api.get<FormResponse[]>(`/responses?formId=${formId}`);
    console.log('data', data);
    return data;
  },

  getResponse: async (responseId: number): Promise<FormResponse> => {
    const { data } = await api.get<FormResponse>(`/responses/${responseId}`);
    return data;
  },

  createResponse: async (formId: number, response: any): Promise<{ id: number }> => {
    const { data } = await api.post<{ id: number }>('/responses', { formId, response });
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
