import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formApi } from '@/lib/utils/api';
import { Form, FormData } from '@/lib/type';

export const useForms = () => {
  return useQuery<Form[], Error>({
    queryKey: ['forms'],
    queryFn: formApi.getForms,
  });
};

export const useForm = (formId: number) => {
  return useQuery<Form, Error>({
    queryKey: ['form', formId],
    queryFn: () => formApi.getForm(formId),
    enabled: !!formId,
  });
};

export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation<{ id: number }, Error, { message: string; duplicated?: boolean }>({
    mutationFn: ({ message, duplicated=false }) => formApi.createForm(message, duplicated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};


export const useUpdateForm = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { formId: number; jsonform: FormData }, { previousForm: Form | undefined }>({
    mutationFn: ({ formId, jsonform }) => formApi.updateForm(formId, jsonform),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['form', variables.formId] });
    },
    // Optimistic update
    onMutate: async ({ formId, jsonform }) => {
      await queryClient.cancelQueries({ queryKey: ['form', formId] });
      const previousForm = queryClient.getQueryData<Form>(['form', formId]);
      
      if (previousForm) {
        const updatedForm: Form = {
          ...previousForm,
          jsonform: JSON.stringify(jsonform),
        };
        queryClient.setQueryData<Form>(['form', formId], updatedForm);
      }
      
      return { previousForm };
    },
    onError: (_, __, context) => {
      if (context?.previousForm) {
        queryClient.setQueryData(['form', context.previousForm.id], context.previousForm);
      }
    },
  });
};


export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number, { previousForms: Form[] | undefined }>({
    mutationFn: formApi.deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    // Optimistic update
    onMutate: async (formId) => {
      await queryClient.cancelQueries({ queryKey: ['forms'] });
      const previousForms = queryClient.getQueryData<Form[]>(['forms']);
      queryClient.setQueryData<Form[]>(['forms'], old => old?.filter(form => form.id !== formId));
      return { previousForms };
    },
    onError: (_, __, context) => {
      if (context?.previousForms) {
        queryClient.setQueryData(['forms'], context.previousForms);
      }
    },
  });
};


export const useTotalStats = () => {
  return useQuery<{ submissions: number; visits: number, submissionRate: number, bounceRate: number }, Error>({
    queryKey: ['stats'],
    queryFn: formApi.getTotalStats,
  });
};

export const useStats = (formId: number) => {
  return useQuery<{ submissions: number; visits: number }, Error>({
    queryKey: ['stats', formId],
    queryFn: () => formApi.getStats(formId),
    enabled: !!formId,
  });
};