import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return "";

  return name
      .trim()
      .split(/\s+/) // split by space
      .map(part => part[0].toUpperCase())
      .join("");
}

export const requiredKey = async (keys: string[], body: Record<string, any>): Promise<boolean> => {
  return keys.every((key) => body.hasOwnProperty(key) && body[key] !== undefined && body[key] !== null)
}

export function ellipsis(text: string, maxLength?: number): string {
  let length = maxLength ?? 16
  if (typeof text !== "string") return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}