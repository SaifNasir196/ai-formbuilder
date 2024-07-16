import { navLinks } from "./data";


export type SectionName = (typeof navLinks)[number]["name"];


export type jsonformType = {
  formTitle: string;
  formHeading: string;
  fields: {
    fieldName: string;
    fieldTitle: string;
    fieldType: string;
    placeholder: string;
    label: string;
    required: boolean;
  }[];
}