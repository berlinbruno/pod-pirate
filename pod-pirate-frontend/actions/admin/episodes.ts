"use server";

import { auth } from "@/lib/utils";

export async function handleAdminDeleteEpisode(podcastId: string, episodeId: string) {
  const session = await auth();
  const token = session?.user.accessToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/admin/podcasts/${podcastId}/episodes/${episodeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status === 204) {
      return { success: true, message: "Episode deleted successfully" };
    }

    const error = await res.json();
    return {
      success: false,
      message: error.message || "Failed to delete episode",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
