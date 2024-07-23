import { z } from "zod";
import { FormDataSchema, FieldSchema , optionSchema} from "@/lib/data";

export type editFieldType = {
  label: string;
  placeholder: string;
}

export type Field = z.infer<typeof FieldSchema>;

export type Option = z.infer<typeof optionSchema>;

export type FormData = z.infer<typeof FormDataSchema>;

export type Form = {
  id: number;
  jsonform: string;
  createdBy: string;
  createdAt: Date;
};


export type FormResponse = {
  id: number,
  formId: number,
  response: string,
  respondedAt: Date,
}

export type ParsedFormResponse = {
  id: number
  formId: number
  respondedAt: string
  name?: string
  email?: string
  keyQuestion?: string
}