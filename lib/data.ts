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
. based on the previous sentence create a json string of format FormDataSchema: z.ZodObject<{
    formTitle: z.ZodString;
    formHeading: z.ZodString;
    fields: z.ZodArray<z.ZodObject<{
        fieldName: z.ZodString;
        fieldType: z.ZodString;
        label: z.ZodString;
        placeholder: z.ZodOptional<z.ZodString>;
        min: z.ZodOptional<...>;
        max: z.ZodOptional<...>;
        max: z.ZodOptional<...>;
        required: z.ZodOptional<...>;
        options: z.ZodOptional<...>;
    }>>;

    and
    optionSchema = z.object({
        label: z.string(),
        value: z.string()
    });

}>
. There are 11 types of fields in the form, email, string, number, tel, url, date, select, checkbox (for multi select), radio, select, file, switch. 
  Give a parseable string, only give json content and nothing else.
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


