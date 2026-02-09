"use server";

import { RegisterFormInputs, EmailInputs } from "@/utils/validation/formSchema";
import { GenericResult, RegisterResult, VerificationType } from "@/types/auth";
import type { GeneralResponse, RegisterRequest, RegisterResponse } from "@/types/api";

/**
 * Server action to handle user registration
 * @param data - Registration form inputs
 * @returns RegisterResult with success status and message
 */
export async function handleRegistration(data: RegisterFormInputs): Promise<RegisterResult> {
  try {
    // Prepare request payload matching backend API structure
    const payload: RegisterRequest = {
      email: data.email,
      password: data.password,
      username: data.username,
      bio: data.bio,
    };

    const res = await fetch(`${process.env.NEXT_BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const result: RegisterResponse = await res.json();
      return {
        success: true,
        message: result.emailVerificationRequired
          ? "Registration successful! Please check your email to verify your account."
          : "Registration successful!",
        data: result,
      };
    }

    if (res.status === 409) {
      const result: GeneralResponse = await res.json();
      return {
        success: false,
        message: result.details,
      };
    }

    if (res.status === 400) {
      const result: GeneralResponse = await res.json();
      return {
        success: false,
        message: result.details,
      };
    }

    return {
      success: false,
      message: "Registration failed. Please try again later.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

/**
 * Server action to request email verification token
 * @param data - Email input
 * @param type - Verification type (EMAIL or PASSWORD_RESET)
 * @returns GenericResult with success status and message
 */
export async function handleGetVerification(
  data: EmailInputs,
  type: VerificationType,
): Promise<GenericResult> {
  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/auth/verification-token?email=${encodeURIComponent(data.email)}&type=${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 202) {
      const message =
        type === "EMAIL"
          ? "Verification email sent! Please check your inbox."
          : type === "PASSWORD_RESET"
            ? "Password reset email sent! Please check your inbox."
            : type === "DELETION"
              ? "Account deletion email sent! Please check your inbox."
              : "Verification email sent! Please check your inbox.";
      return { success: true, message };
    }

    if (res.status === 404) {
      return {
        success: false,
        message: "Email address not found.",
      };
    }

    if (res.status === 429) {
      return {
        success: false,
        message: "Too many requests. Please try again later.",
      };
    }

    return {
      success: false,
      message: "Failed to send verification email. Please try again later.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

/**
 * Server action to verify email with token
 * @param data - Email input
 * @param token - Verification token from email
 * @returns GenericResult with success status and message
 */
export async function handleVerifyEmail(
  data: EmailInputs,
  token: string | null,
): Promise<GenericResult> {
  if (!token) {
    return { success: false, message: "No verification token provided." };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_BACKEND_URL}/api/auth/verify-email?email=${encodeURIComponent(data.email)}&token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status === 204) {
      return {
        success: true,
        message: "Email verified successfully! You can now log in.",
      };
    }

    if (res.status === 400) {
      return {
        success: false,
        message: "Invalid or expired verification token. Please request a new one.",
      };
    }

    if (res.status === 404) {
      return {
        success: false,
        message: "Email address not found.",
      };
    }

    return {
      success: false,
      message: "Email verification failed. Please try again later.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
