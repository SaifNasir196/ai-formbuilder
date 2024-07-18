import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { validations } from "@/lib/data";
import { FormData, fieldType } from "@/lib/type";
import { z } from "zod";
import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
});

// let model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro",
//   generationConfig: {
//     responseMimeType: "application/json",
//     responseSchema: {
//       type: FunctionDeclarationSchemaType.OBJECT,
//       properties: {
//         formTitle: {
//           type: FunctionDeclarationSchemaType.STRING,
//         },
//         formHeading: {
//           type: FunctionDeclarationSchemaType.STRING,
//         },
//         fields: {
//           type: FunctionDeclarationSchemaType.ARRAY,
//           items: {
//             type: FunctionDeclarationSchemaType.OBJECT,
//             properties: {
//               fieldName: {
//                 type: FunctionDeclarationSchemaType.STRING,
//               },
//               fieldType: {
//                 type: FunctionDeclarationSchemaType.STRING,
//               },
//               label: {
//                 type: FunctionDeclarationSchemaType.STRING,
//               },
//               placeholder: {
//                 type: FunctionDeclarationSchemaType.STRING,
//                 optional: true,
//               },
//               min: {
//                 type: FunctionDeclarationSchemaType.NUMBER,
//                 optional: true,
//               },
//               max: {
//                 type: FunctionDeclarationSchemaType.NUMBER,
//                 optional: true,
//               },
//               required: {
//                 type: FunctionDeclarationSchemaType.BOOLEAN,
//                 optional: true,
//               },
//               options: {
//                 type: FunctionDeclarationSchemaType.ARRAY,
//                 optional: true,
//                 items: {
//                   type: FunctionDeclarationSchemaType.OBJECT,
//                   properties: {
//                     label: {
//                       type: FunctionDeclarationSchemaType.STRING,
//                     },
//                     value: {
//                       type: FunctionDeclarationSchemaType.STRING,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   }
// });


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