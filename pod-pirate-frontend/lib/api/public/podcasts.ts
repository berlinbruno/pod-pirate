import type { PodcastPublicDetailResponse, PodcastPublicResponse } from "@/types/api";

const API_URL = process.env.NEXT_BACKEND_URL!;

export async function getPodcastById(
  podcastId: string,
): Promise<PodcastPublicDetailResponse | null> {
  const res = await fetch(`${API_URL}/api/public/podcasts/${podcastId}`, {
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch podcast");
  }

  return res.json();
}

export async function getPodcasts(
  page: number = 0,
  category?: string,
): Promise<{
  content: PodcastPublicResponse[];
  page: { number: number; totalPages: number };
} | null> {
  try {
    const url = category
      ? `${API_URL}/api/public/podcasts?category=${encodeURIComponent(category)}&page=${page}`
      : `${API_URL}/api/public/podcasts?page=${page}`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return {
      content: data.content || [],
      page: {
        number: data.page?.number ?? page,
        totalPages: data.page?.totalPages ?? 0,
      },
    };
  } catch (error) {
    return null;
  }
}

export async function getPodcastsByQuery(
  page: number = 0,
  category: string | null = null,
  query: string | null = null,
): Promise<{
  content: PodcastPublicResponse[];
  page: { number: number; totalPages: number };
} | null> {
  const params = new URLSearchParams({
    page: String(page),
    size: "20",
  });

  if (category) {
    params.set("category", category);
  }

  if (query && query.trim().length > 0) {
    params.set("q", query.trim());
  }

  try {
    const res = await fetch(`${API_URL}/api/public/podcasts?${params.toString()}`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return {
      content: data.content || [],
      page: {
        number: data.page?.number ?? page,
        totalPages: data.page?.totalPages ?? 0,
      },
    };
  } catch (error) {
    return null;
  }
}
