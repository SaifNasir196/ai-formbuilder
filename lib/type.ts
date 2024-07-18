import { navLinks } from "./data";
import { z } from "zod";
import { FormDataSchema, FieldSchema , optionSchema} from "@/lib/data";


export type editFieldType = {
  label: string;
  placeholder: string;
}

export type fieldType = z.infer<typeof FieldSchema>;

export type optionType = z.infer<typeof optionSchema>;

export type FormData = z.infer<typeof FormDataSchema>;
