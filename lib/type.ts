import { navLinks } from "./data";


export type SectionName = (typeof navLinks)[number]["name"];


export type jsonformType = {
  formTitle: string;
  formHeading: string;
  fields: fieldType[];
}

export type fieldType = {
  fieldName: string;
  fieldTitle: string;
  fieldType: string;
  placeholder: string;
  label: string;
  required: boolean;
}

export type editFieldType = {
  label: string;
  placeholder: string;
}