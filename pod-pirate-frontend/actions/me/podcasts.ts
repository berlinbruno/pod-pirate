"use server";

import { auth } from "@/lib/utils";
import { CreatePodcastRequest, UpdatePodcastRequest } from "@/types/api";

export async function handleCreatePodcast(data: CreatePodcastRequest) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me/podcasts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to create podcast",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Podcast created successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleGetPodcastImageUploadUrl(
  podcastId: string,
  extension: "PNG" | "JPG" | "WEBP",
  imageType: "PODCAST_BANNER" | "PODCAST_COVER",
) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/podcast-image/upload-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          extension,
          imageType,
        }),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to get upload URL",
      };
    }

    const result = await res.json();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleUpdatePodcast(podcastId: string, data: UpdatePodcastRequest) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to update podcast",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Podcast updated successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handlePublishPodcast(podcastId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/publish`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to publish podcast",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Podcast published successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleArchivePodcast(podcastId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/archive`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to archive podcast",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Podcast archived successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleDeletePodcast(podcastId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to delete podcast",
      };
    }

    return {
      success: true,
      message: "Podcast deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
