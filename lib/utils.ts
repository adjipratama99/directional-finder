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
