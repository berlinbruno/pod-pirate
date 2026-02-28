"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidates the cache for a specific path.
 * Used when signed URLs expire and fresh data is needed.
 */
export async function revalidatePathAction(path: string): Promise<void> {
  try {
    revalidatePath(path);
  } catch (error) {
    console.error("Failed to revalidate path:", path, error);
  }
}
