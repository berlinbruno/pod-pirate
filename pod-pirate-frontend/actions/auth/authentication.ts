"use server";

import { LoginFormInputs } from "@/utils/validation/formSchema";
import { GeneralResponse } from "@/types/api/responses";

/**
 * Server action to handle user sign out with backend notification
 * @param data - Login form inputs (email)
 * @param token - Access token for authentication
 */
export async function handleSignOut(data: LoginFormInputs, token: string) {
  if (!token) {
    return { success: false, message: "No access token provided." };
  }
  try {
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.status === 204) {
      return { success: true, message: "Successfully signed out." };
    }
    const result: GeneralResponse = await res.json();
    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
