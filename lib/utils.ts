import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseJsonFormString(rawString: string) {
  try {
    // Extract the JSON part
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = rawString.match(jsonRegex);
    
    if (!match) {
      throw new Error("No JSON found in the string");
    }

    const jsonString = match[1];
    
    // Parse the JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON form:", error);
    return null;
  }
}
