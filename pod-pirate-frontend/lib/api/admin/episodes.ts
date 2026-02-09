import { auth } from "@/lib/utils";
import { EpisodeDetailResponse } from "@/types/api";

const API_URL = process.env.NEXT_BACKEND_URL!;

export async function getAdminEpisodesById(podcastId: string): Promise<EpisodeDetailResponse[]> {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return [];
  }
  try {
    const res = await fetch(`${API_URL}/api/admin/podcasts/${podcastId}/episodes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
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
