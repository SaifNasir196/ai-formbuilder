import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { validations } from "@/lib/data";
import { FormData, fieldType } from "@/lib/type";
import { z } from "zod";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const createDynamicSchema = (jsonData: FormData) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  jsonData.fields.forEach(field => {
    schemaFields[field.fieldName] = createFieldSchema(field);
  });

  return z.object(schemaFields);
}

const createFieldSchema = (field: fieldType) => {
  const isRequired = field.required || false;

  // Start with base schema based on field type
  let schema: z.ZodTypeAny;
  switch (field.fieldType) {
    case 'email':
      schema = validations.email(isRequired);
      break;
    case 'number':
      schema = validations.number(isRequired, field.min, field.max);
      break;
    case 'tel':
      schema = validations.tel(isRequired);
      break;
    case 'url':
      schema = validations.url(isRequired);
      break;
    case 'date':
      schema = validations.date(isRequired);
      break;
    case 'time':
      schema = validations.time(isRequired);
      break;
    case 'checkbox':
      schema = validations.checkbox(isRequired);
      break;
    case 'radio':
    case 'select':
      schema = validations[field.fieldType](field.options || [], isRequired);
      break;
    case 'file':
      schema = validations.file(isRequired);
      break;
    default:
      schema = validations.string(isRequired);
  }
  return schema;

}