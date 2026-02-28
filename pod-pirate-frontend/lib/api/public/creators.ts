import type { CreatorPublicResponse, PodcastPublicResponse } from "@/types/api";

const API_URL = process.env.NEXT_BACKEND_URL!;

export async function getCreatorIds(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/creators/ids`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch creator IDs:", error);
    return [];
  }
}

export async function getCreatorById(userId: string): Promise<CreatorPublicResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/creators/${userId}`, {
      next: { revalidate: 300 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}

export async function getCreatorPodcasts(
  userId: string,
  page: number = 0,
  size: number = 10,
): Promise<{
  content: PodcastPublicResponse[];
  page?: { number: number; totalPages: number };
} | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/public/creators/${userId}/podcasts?page=${page}&size=${size}`,
      {
        next: { revalidate: 120 },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}
