"use server";

import { auth } from "@/lib/utils";
import { CreateEpisodeRequest, UpdateEpisodeRequest } from "@/types/api";

export async function handleCreateEpisode(podcastId: string, data: CreateEpisodeRequest) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/episodes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to create episode",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Episode created successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleUpdateEpisode(
  podcastId: string,
  episodeId: string,
  data: UpdateEpisodeRequest,
) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/episodes/${episodeId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to update episode",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Episode updated successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleGetEpisodeImageUploadUrl(
  podcastId: string,
  episodeId: string,
  extension: "PNG" | "JPG" | "WEBP",
) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/episodes/${episodeId}/episode-image/upload-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          extension,
          imageType: "EPISODE_THUMBNAIL",
        }),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to get image upload URL",
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

export async function handleGetEpisodeAudioUploadUrl(
  podcastId: string,
  episodeId: string,
  extension: "MP3" | "WAV" | "AAC" | "FLAC" | "OGG",
) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/episodes/${episodeId}/episode-audio/upload-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          extension,
          audioType: "EPISODE_AUDIO",
        }),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to get audio upload URL",
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

export async function handlePublishEpisode(podcastId: string, episodeId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/episodes/${episodeId}/publish`,
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
        message: error.message || "Failed to publish episode",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Episode published successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleArchiveEpisode(podcastId: string, episodeId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/episodes/${episodeId}/archive`,
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
        message: error.message || "Failed to archive episode",
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Episode archived successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleDeleteEpisode(podcastId: string, episodeId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/me/podcasts/${podcastId}/episodes/${episodeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to delete episode",
      };
    }

    return {
      success: true,
      message: "Episode deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
