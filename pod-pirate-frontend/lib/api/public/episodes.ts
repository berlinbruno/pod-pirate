import { EpisodePublicResponse } from "@/types/api";

const API_URL = process.env.NEXT_BACKEND_URL!;

export async function getEpisodes(podcastId: string): Promise<EpisodePublicResponse[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/podcasts/${podcastId}/episodes`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return data;
  } catch (error) {
    return [];
  }
}
