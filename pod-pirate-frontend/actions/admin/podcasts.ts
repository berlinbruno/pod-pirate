"use server";

import { auth } from "@/lib/utils";

export async function handleAdminDeletePodcast(podcastId: string) {
  const session = await auth();
  const token = session?.user.accessToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/admin/podcasts/${podcastId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      return { success: true, message: "Podcast deleted successfully" };
    }

    const error = await res.json();
    return {
      success: false,
      message: error.message || "Failed to delete podcast",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleFlagPodcast(podcastId: string) {
  const session = await auth();
  const token = session?.user.accessToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/admin/podcasts/${podcastId}/flag`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status === 204) {
      return { success: true, message: "Podcast flagged successfully" };
    }

    const error = await res.json();
    return {
      success: false,
      message: error.message || "Failed to flag podcast",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleUnflagPodcast(podcastId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  if (!token) {
    throw new Error("Unauthorized");
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/admin/podcasts/${podcastId}/unflag`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status === 204) {
      return { success: true, message: "Podcast unflagged successfully" };
    }

    const error = await res.json();
    return {
      success: false,
      message: error.message || "Failed to unflag podcast",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
