import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { responsesApi } from '@/lib/utils/api';
import { Form, FormData, FormResponse } from '@/lib/type';


export const useResponses = (formId: number) => {
  return useQuery<FormResponse[], Error>({
    queryKey: ['responses', formId],
    queryFn: () => responsesApi.getResponses(formId),
    enabled: !!formId,
  });
};

export const useResponse = (responseId: number) => {
  return useQuery<FormResponse, Error>({
    queryKey: ['response', responseId],
    queryFn: () => responsesApi.getResponse(responseId),
    enabled: !!responseId,
  });
};

// fix this typing first 
export const useCreateResponse = () => {
  const queryClient = useQueryClient();
  return useMutation<{ id: number }, Error, { formId: number; response: string }>({
    mutationFn: ({ formId, response }) => responsesApi.createResponse(formId, response),
    onSuccess: (newResponse) => {
      queryClient.invalidateQueries({ queryKey: ['responses', newResponse ] });
    },
  });
};


// export const useUpdateResponse = () => {
//   const queryClient = useQueryClient();
//   return useMutation<void, Error, { responseId: number; response: FormResponse }>({
//     mutationFn: ({ responseId, response }) => responsesApi.updateResponse(responseId, response),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['response', variables.responseId] });
//     },
//   });
// };

export const useDeleteResponse = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: responsesApi.deleteResponse,
    onSuccess: (_, responseId) => {
      queryClient.invalidateQueries({ queryKey: ['responses'] });
      queryClient.removeQueries({ queryKey: ['response', responseId] });
    },
  });
};

export const useResponsesCount = (formId: number) => {
  return useQuery<number, Error>({
    queryKey: ['responsesCount', formId],
    queryFn: () => responsesApi.getResponsesCount(formId),
    enabled: !!formId,
  });
};