import { clsx, type ClassValue } from "clsx";
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge";
import { authOptions } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the current session in Server Components and Server Actions
 * @returns Promise<Session | null>
 */
export async function auth() {
  return await getServerSession(authOptions);
}
