import { auth } from "@/lib/utils";
import type { AdminPodcastDetailResponse, AdminPodcastResponse } from "@/types/api";

const API_URL = process.env.NEXT_BACKEND_URL!;

export async function getAdminPodcastsByQuery(
  page = 0,
  status: "DRAFT" | "FLAGGED" | "ARCHIVED" | "PUBLISHED" | null,
  query: string | null = null,
): Promise<{
  content: AdminPodcastResponse[];
  page: { number: number; totalPages: number };
} | null> {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) return null;

  const params = new URLSearchParams({
    page: String(page),
    size: "20",
  });

  if (status) {
    params.set("status", status);
  }

  if (query && query.trim().length > 0) {
    params.set("q", query.trim());
  }
  try {
    const res = await fetch(`${API_URL}/api/admin/podcasts?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
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

export async function getAdminPodcastById(podcastId: string): Promise<{
  content: AdminPodcastDetailResponse;
} | null> {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${API_URL}/api/admin/podcasts/${podcastId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return {
      content: data as AdminPodcastDetailResponse,
    };
  } catch (error) {
    return null;
  }
}
