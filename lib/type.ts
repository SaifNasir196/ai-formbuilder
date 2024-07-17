import { navLinks } from "./data";
import { z } from "zod";
import { FormDataSchema, FieldSchema } from "@/lib/data";


export type SectionName = (typeof navLinks)[number]["name"];


export type jsonformType = {
  formTitle: string;
  formHeading: string;
  fields: fieldType[];
}

export type editFieldType = {
  label: string;
  placeholder: string;
}

// export type fieldType = {
//   fieldName: string;
//   fieldTitle: string;
//   fieldType: string;
//   placeholder: string;
//   label: string;
//   required: boolean;
// }

export type fieldType = z.infer<typeof FieldSchema>;

export type FormData = z.infer<typeof FormDataSchema>;
