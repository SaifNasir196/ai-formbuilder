import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { validations } from "@/lib/data";
import { FormData, fieldType } from "@/lib/type";
import { z } from "zod";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const createDynamicSchema = (jsonData: FormData | undefined) => {
  if (!jsonData) { 
    return z.object({});
  }

  const schemaFields: Record<string, z.ZodTypeAny> = {};

  jsonData.fields.forEach(field => {
    schemaFields[field.fieldName] = createFieldSchema(field);
  });
  // console.log('Schema:', schemaFields);

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
    case 'checkbox':
      schema = validations.checkbox(isRequired);
      break;
    case 'radio':
    case 'select':
      if (!field.options || field.options.length === 0 || typeof field.options[0] !== 'object' || typeof field.options[0].value !== 'string' || typeof field.options[0].label !== 'string'){
        throw new Error('Field options are missing'); // If this happens ask user to reenter prompt
      }
      console.log('Options:', field.options);
      schema = validations[field.fieldType](field.options || [], isRequired);
      break;
    case 'file':
      schema = validations.file(isRequired);
      break;
    default:
      schema = validations.string(isRequired, field.min || 0 , field.max || 255);
  }
  console.log('Field:', field.fieldName, schema._def);
  return schema;

}