"use server";

import { auth } from "@/lib/utils";

export async function handleLockUser(userId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/admin/users/${userId}/lock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      return { success: true, message: "User locked successfully" };
    }

    const error = await res.json();
    return {
      success: false,
      message: error.message || "Failed to lock user",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleUnlockUser(userId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/admin/users/${userId}/unlock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      return { success: true, message: "User unlocked successfully" };
    }

    const error = await res.json();
    return {
      success: false,
      message: error.message || "Failed to unlock user",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function handleDeleteUser(userId: string) {
  const session = await auth();
  const token = session?.user.accessToken;
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      return { success: true, message: "User deleted successfully" };
    }

    const error = await res.json();
    return {
      success: false,
      message: error.message || "Failed to delete user",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
