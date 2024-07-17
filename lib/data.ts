import { z } from "zod";

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

export const PROMPT = ". based on the previous sentence create a json string of format with formTitle, formHeading, along with fieldName, fieldTitle, fieldType, placeholder, label, required fields. make sure to not include the json markup (```json), only give the string, only give json content and nothing else." as const;

// Predefined validation functions
export const validations = {
    email: (required = false, message = "Invalid email format") => {
        let schema = z.string().email({ message });
        return required ? schema.min(1, { message: "Email is required" }) : schema.optional();
    },

    string: (required = false, minLength = 0, maxLength = 255) => {
        let schema = z.string()
        .min(minLength, { message: `Minimum length must be ${minLength}` })
        .max(maxLength, { message: `Maximum length is ${maxLength}` });
        return required ? schema.min(1, { message: "This field is required" }) : schema.optional();
    },

    number: (required = false, min?: number, max?: number) => {
        let schema = z.number();
        if (min !== undefined) schema = schema.min(min, { message: `Minimum value is ${min}` });
        if (max !== undefined) schema = schema.max(max, { message: `Maximum value is ${max}` });
        return required ? schema : schema.optional();
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
        let schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message });
        return required ? schema.min(1, { message: "Date is required" }) : schema.optional();
    },

    time: (required = false, message = "Invalid time format (HH:MM)") => {
        let schema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message });
        return required ? schema.min(1, { message: "Time is required" }) : schema.optional();
    },

    checkbox: (required = false) => {
        let schema = z.boolean();
        return required ? schema : schema.optional();
    },
    radio: (options: string[], required = false) => {
        let schema = z.enum(options as [string, ...string[]]);
        return required ? schema : schema.optional();
    },

    select: (options: string[], required = false) => {
        let schema = z.enum(options as [string, ...string[]]);
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
  options: z.array(z.string()).optional()
});

// Define the structure of your form data
export const FormDataSchema = z.object({
  formTitle: z.string(),
  formHeading: z.string(),
  fields: z.array(FieldSchema)
});


