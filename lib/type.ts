import { navLinks } from "./data";
import { z } from "zod";
import { FormDataSchema, FieldSchema , optionSchema} from "@/lib/data";
import { forms } from "@/config/schema";


export type editFieldType = {
  label: string;
  placeholder: string;
}

export type fieldType = z.infer<typeof FieldSchema>;

export type optionType = z.infer<typeof optionSchema>;

export type FormDataType = z.infer<typeof FormDataSchema>;

export type FormType = {
  id: number;
  jsonform: string;
  createdBy: string;
  createdAt: Date;
};