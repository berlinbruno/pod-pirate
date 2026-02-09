"use server";

import { ResetPasswordFormInputs, ChangePasswordFormInputs } from "@/utils/validation/formSchema";
import { GeneralResponse } from "@/types/api/responses";
import { auth } from "@/lib/utils";
import { GenericResult } from "@/types/auth";

/**
 * Server action to reset password with token
 * @param data - Reset password form inputs
 * @param token - Verification token from email
 * @returns GenericResult with success status and message
 */
export async function handleResetPassword(
  data: ResetPasswordFormInputs,
  token: string,
): Promise<GenericResult> {
  if (!token) {
    return { success: false, message: "No verification token provided." };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/auth/password/reset?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      },
    );

    if (res.status === 204) {
      return {
        success: true,
        message: "Password reset successfully! You can now log in with your new password.",
      };
    }

    if (res.status === 400) {
      return {
        success: false,
        message: "Invalid password or requirements not met.",
      };
    }

    if (res.status === 401) {
      return {
        success: false,
        message: "Invalid or expired verification token. Please request a new reset link.",
      };
    }

    return {
      success: false,
      message: "Password reset failed. Please try again later.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

/**
 * Server action to change password for authenticated user
 * @param data - Change password form inputs
 * @returns GenericResult with success status and message
 */
export async function handleChangePassword(data: ChangePasswordFormInputs): Promise<GenericResult> {
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
    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/auth/password/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        email: email,
      }),
    });

    if (res.status === 204) {
      return { success: true, message: "Password changed successfully." };
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
