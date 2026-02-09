import { auth } from "@/lib/utils";
import type { AdminUserDetailResponse, AdminUserResponse } from "@/types/api";

const API_URL = process.env.NEXT_BACKEND_URL!;

export async function getAdminUsers(
  page: number = 0,
  status: "LOCKED" | "ACTIVE" | "PENDING_VERIFICATION" | null,
  token: string | undefined,
): Promise<{
  content: AdminUserResponse[];
  page: { number: number; totalPages: number };
} | null> {
  try {
    const url = status
      ? `${API_URL}/api/admin/users?status=${status}&page=${page}&size=20`
      : `${API_URL}/api/admin/users?page=${page}&size=20`;

    const res = await fetch(url, {
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

export async function getAdminUsersByQuery(
  page: number = 0,
  status: "LOCKED" | "ACTIVE" | "PENDING_VERIFICATION" | null,
  role: "USER" | "ADMIN" | null,
  query: string,
): Promise<{
  content: AdminUserResponse[];
  page: { number: number; totalPages: number };
} | null> {
  const session = await auth();
  const token = session?.user?.accessToken;

  const params = new URLSearchParams({
    page: String(page),
    size: "20",
  });

  if (status) {
    params.set("status", status);
  }

  if (role) {
    params.set("role", role);
  }

  if (query && query.trim().length > 0) {
    params.set("q", query.trim());
  }

  try {
    const res = await fetch(`${API_URL}/api/admin/users?${params.toString()}`, {
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

export async function getAdminUserById(
  userId: string,
  token: string | undefined,
): Promise<{
  content: AdminUserDetailResponse;
} | null> {
  try {
    const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
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
      content: data as AdminUserDetailResponse,
    };
  } catch (error) {
    return null;
  }
}
