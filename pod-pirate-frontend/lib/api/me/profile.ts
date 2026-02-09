import type { UserProfileResponse } from "@/types/api";

const API_URL = process.env.NEXT_BACKEND_URL!;

export async function getCurrentUser(accessToken?: string): Promise<UserProfileResponse | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch(`${API_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}
