import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { responsesApi } from '@/lib/utils/api';
import { Form, FormData, FormSubmission, ParsedFormSubmission } from '@/lib/type';

// export type FormSubmission = {
//   id: number;
//   formId: number;
//   submittedAt: DateTime;
//   submission: string;
// };

// export type ParsedFormSubmission = {
//   id: number;
//   formId: number;
//   submittedAt: DateTime;
//   firstName: string
//   lastName: string
//   email: string
//   submission: string;
// }


export const useSubmissions = (formId: number) => {
  return useQuery<FormSubmission[], Error>({
    queryKey: ['responses', formId],
    queryFn: () => responsesApi.getResponses(formId),
    enabled: !!formId,
  });
};

export const useSubmission = (responseId: number) => {
  return useQuery<FormSubmission, Error>({
    queryKey: ['response', responseId],
    queryFn: () => responsesApi.getResponse(responseId),
    enabled: !!responseId,
  });
};

// figure out queryclient and how to invalidate queries 
export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation<{ id: number }, Error, { formId: number; submission: String }>({
    mutationFn: ({ formId, submission }) => responsesApi.createResponse(formId, submission),
    onSuccess: (newResponse) => {
      queryClient.invalidateQueries({ queryKey: ['responses', newResponse ] });
    },
  });
};


// export const useUpdateResponse = () => {
//   const queryClient = useQueryClient();
//   return useMutation<void, Error, { responseId: number; response: FormSubmission }>({
//     mutationFn: ({ responseId, response }) => responsesApi.updateResponse(responseId, response),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['response', variables.responseId] });
//     },
//   });
// };

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: responsesApi.deleteResponse,
    onSuccess: (_, responseId) => {
      queryClient.invalidateQueries({ queryKey: ['responses'] });
      queryClient.removeQueries({ queryKey: ['response', responseId] });
    },
  });
};

export const useCountSubmissions = (formId: number) => {
  return useQuery<number, Error>({
    queryKey: ['responsesCount', formId],
    queryFn: () => responsesApi.getResponsesCount(formId),
    enabled: !!formId,
  });
};