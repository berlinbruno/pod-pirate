/**
 * Decoded JWT Access Token Structure
 */
export interface DecodedAccessToken {
  sub: string; // subject (email)
  iat: number; // issued at
  exp: number; // expiration time
}

/**
 * Decoded JWT Refresh Token Structure
 */
export interface DecodedRefreshToken {
  sub: string; // subject with #refresh prefix
  iat: number; // issued at
  exp: number; // expiration time
}

/**
 * Login Action Result
 */
export type LoginResult =
  | { success: true; linkState: null; message: string }
  | {
      success: false;
      linkState: "ACCOUNT_NEED_VERIFICATION" | "INVALID_CREDENTIALS" | "ACCOUNT_LOCKED" | null;
      message: string;
    };

/**
 * Registration Action Result
 */
export type RegisterResult =
  | {
      success: true;
      message: string;
      data: {
        userId: string;
        username: string;
        email: string;
        emailVerificationRequired: boolean;
      };
    }
  | { success: false; message: string; data?: never };

/**
 * Email Verification Type Enum
 */
export type VerificationType = "EMAIL" | "DELETION" | "PASSWORD_RESET";

/**
 * Generic Action Result
 */
export type GenericResult =
  | { success: true; message: string }
  | { success: false; message: string };
