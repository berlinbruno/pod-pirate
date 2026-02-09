"use server";

import { auth } from "@/lib/utils";
import { GeneralResponse } from "@/types/api/responses";
import { SignoutFormInputs } from "@/utils/validation/formSchema";

export async function handleSignOut(data: SignoutFormInputs) {
  const session = await auth();
  const token = session?.user?.accessToken;
  const email = session?.user?.email;

  if (!email) {
    return {
      success: false,
      message: "Email is missing. Please login again.",
    };
  }

  if (!token) {
    return {
      success: false,
      message: "Authentication required. Please login again.",
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, email }),
    });

    if (res.status === 204) {
      return { success: true, message: "Successfully signed out." };
    }
    const result: GeneralResponse = await res.json();
    return { success: false, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
