import { z } from "zod";
import { Option } from "./type";

export const navLinks = [
    {
        name: "My Forms",
        path: "/forms"
    },
    {
        name: "Responses",
        path: "/responses"
    },
    {
        name: "Analytics",
        path: "/analytics"
    },
    {
        name: "Pricing",
        path: "/pricing"
    },
] as const

export const PROMPT = `
. Based on the user's prompt, create a form using the following guidelines:

1. Generate a JSON object that follows this structure:
   {
     "formTitle": "A concise, relevant title for the form",
     "formHeading": "A brief description or instruction for the form",
     "fields": [
       // Array of field objects
     ]
   }

2. Always include the following fields, regardless of the user's prompt:
   - First Name (string type, required)
   - Last Name (string type, required)
   - Email (email type, required)

3. Each field in the "fields" array should be an object with these properties:
   - fieldName: A unique, camelCase identifier for the field
   - fieldType: One of the following types:
     "email", "string", "number", "tel", "url", "date", "select", "checkbox", "radio", "file", "switch"
   - label: A clear, concise label for the field
   - placeholder: (optional) Placeholder text for the field
   - min: (optional) Minimum value for number fields or minimum length for string fields
   - max: (optional) Maximum value for number fields or maximum length for string fields
   - required: (optional) Boolean indicating if the field is required
   - options: (required for select, checkbox, and radio types) An array of option objects, each with "label" and "value" properties

4. Use the appropriate fieldType based on the nature of the information requested:
   - "email" for email addresses
   - "string" for general text input
   - "number" for numeric input
   - "tel" for phone numbers
   - "url" for website URLs
   - "date" for date input
   - "select" for dropdown selection from multiple options
   - "checkbox" for multiple-choice selection
   - "radio" for single-choice selection from multiple options
   - "file" for file uploads
   - "switch" for simple on/off toggles

5. Include relevant validation:
   - Use "required: true" for essential fields
   - Set appropriate "min" and "max" values for number and string fields
   - Provide comprehensive "options" arrays for select, checkbox, and radio fields

6. Ensure the form structure is logical and user-friendly, with related fields grouped together.

7. Limit the form to essential fields only, avoiding unnecessary complexity.

8. Always include First Name, Last Name, and Email fields at the beginning of the form, even if the user's prompt explicitly states not to include them.

Generate a complete, valid JSON object representing the form based on these guidelines and the user's prompt.
` as const;


export const optionSchema = z.object({
    label: z.string(),
    value: z.string()
});

// Predefined validation functions
export const validations = {
    email: (required = false, message = "Invalid email format") => {
        let schema = z.string().email({ message });
        return required ? schema.min(1, { message: "Email is required" }) : schema.optional();
    },

    string: (required = false, min = 0, max = 255) => {
        let schema = z.string()
        .min(min, { message: `Minimum length must be ${min}` })
        .max(max, { message: `Maximum length is ${max}` });
        return required ? schema.min(1, { message: "This field is required" }) : schema.optional();
    },

    number: (required = false, min?: number, max?: number) => {
        let schema = z.number();
        if (min !== undefined) schema = schema.min(min, { message: `Minimum value is ${min}` });
        if (max !== undefined) schema = schema.max(max, { message: `Maximum value is ${max}` });
        return required ? schema.min(1, { message: "This field is required" }) : schema.optional();
    },

    tel: (required = false, message = "Invalid phone number") => {
        let schema = z.string().regex(/^\+?[1-9]\d{1,14}$/, { message });
        return required ? schema.min(1, { message: "Phone number is required" }) : schema.optional();
    },

    url: (required = false, message = "Invalid URL") => {
        let schema = z.string().url({ message });
        return required ? schema.min(1, { message: "URL is required" }) : schema.optional();
    },

    date: (required = false, message = "Invalid date format (YYYY-MM-DD)") => {
        // let schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message });
        // return required ? schema.min(1, { message: "Date is required" }) : schema.optional();
        // use z.date() instead of regex
        let schema = z.date();
        return required ? schema : schema.optional();
    },


    checkbox: (required = false) => {
        let schema = z.boolean();
        return required ? schema : schema.optional();
    },
    radio: (options: Option[], required = false) => {
        console.log('Options:', options);
        const values = options.map(option => option.value);
        let schema = z.enum(values as [string, ...string[]]);
        return required ? schema : schema.optional();
    },

    select: (options: Option[], required = false) => {
        const values = options.map(option => option.value);
        let schema = z.enum(values as [string, ...string[]]);
        return required ? schema : schema.optional();
    },

    // this is for terms and conditions
    switch: (required = false) => {
        let schema = z.boolean();
        return required ? schema : schema.optional();
    },

    file: (required = false) => {
        let schema = z.instanceof(File);
        return required ? schema : schema.optional();
    },

}

// Define the structure of your field
export const FieldSchema = z.object({
  fieldName: z.string(),
  fieldType: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  required: z.boolean().optional(),
  options: z.array(optionSchema).optional()
});




// Define the structure of your form data
export const FormDataSchema = z.object({
  formTitle: z.string(),
  formHeading: z.string(),
  fields: z.array(FieldSchema)
});


