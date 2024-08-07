import { tuple, z } from "zod";
import { FormDataSchema, FieldSchema , optionSchema, FormSubmissionSchema} from "@/lib/data";
import { DateTime } from "luxon";

export type editFieldType = {
  label: string;
  placeholder: string;
}

export type Field = z.infer<typeof FieldSchema>;

export type Option = z.infer<typeof optionSchema>;

export type FormData = z.infer<typeof FormDataSchema>;

export type Form = {
  id: number;
  userId: string;
  createdAt: Date;
  published: boolean;
  jsonform: string;
  visits: number;
  submissions: number;
  shareURL: string;
  FormSubmissions: FormSubmission[];
};

export type FormSubmission = z.infer<typeof FormSubmissionSchema>;

export type ParsedFormSubmission = {
  id: number;
  formId: number;
  submittedAt: Date;
  firstName: string
  lastName: string
  email: string
  submission: string;
}

export type Recipient = {
  email: string;
  name: string;
};

export interface PersonalizationData {
  [key: string]: string | number | boolean;
}

export type BulkEmailParams = {
  templateId: string;
  recipients: Recipient[];
  sender: {
    email: string;
    name: string;
  };
}


export type EmailTemplateProps = {
  subject: string;
  body: string;
  recipientName: string;
};


export type EmailResponseData = {
  id: string;
  email: string;
  name: string;
  // Add other fields as needed
};

export type FeedbackData = {
  name: string;
  email: string;
  company?: string;
  source: string;
  recommendation: string;
  feedback: string;
}