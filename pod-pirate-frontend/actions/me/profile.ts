"use server";

import { auth } from "@/lib/utils";
import type { UserProfileResponse } from "@/types/api";
import type { UpdateUsernameFormInputs, UpdateBioFormInputs } from "@/utils/validation/formSchema";

export async function handleUpdateUsername(data: UpdateUsernameFormInputs) {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: data.username }),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to update username",
      };
    }

    const result: UserProfileResponse = await res.json();
    return {
      success: true,
      message: "Username updated successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleUpdateBio(data: UpdateBioFormInputs) {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio: data.bio }),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to update bio",
      };
    }

    const result: UserProfileResponse = await res.json();
    return {
      success: true,
      message: "Bio updated successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleRemoveBio() {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio: true, profileUrl: false }),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to remove bio",
      };
    }

    const result: UserProfileResponse = await res.json();
    return {
      success: true,
      message: "Bio removed successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleGetProfileImageUploadUrl(extension: "PNG" | "JPG" | "WEBP") {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me/profile-image/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        extension,
        imageType: "PROFILE_PICTURE",
      }),
    });

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

export async function handleUpdateProfileImage(profileUrl: string) {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ profileUrl }),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to update profile image",
      };
    }

    const result: UserProfileResponse = await res.json();
    return {
      success: true,
      message: "Profile image updated successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleRemoveProfileImage() {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio: false, profileUrl: true }),
    });

    if (!res.ok) {
      const error = await res.json();
      return {
        success: false,
        message: error.message || "Failed to remove profile image",
      };
    }

    const result: UserProfileResponse = await res.json();
    return {
      success: true,
      message: "Profile image removed successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleDeleteAccount(verificationToken?: string) {
  const session = await auth();
  const token = session?.user?.accessToken;

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/me?token=${verificationToken}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      return { success: true, message: "Account deleted successfully" };
    }

    const result = await res.json();
    return {
      success: false,
      message: result.message || "Failed to delete account",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
