import { useMutation } from '@tanstack/react-query';
import { mailersendApi } from '@/lib/utils/api';
import { BulkEmailParams } from '@/lib/type';

export const useMailerSend = () => {
  return useMutation<any, Error, BulkEmailParams>({
    mutationFn: mailersendApi.sendBulkEmail,
    onError: (error) => {
      console.error('Error sending bulk email:', error);
    },
  });
};
