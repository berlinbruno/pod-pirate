import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Custom User object returned by `authorize` in the credentials provider
   * and accessible in the session.
   */
  interface User {
    id: string;
    email: string;
    roles: string[];
    userName: string;
    profileUrl: string | null;
    accessToken: string;
    refreshToken: string;
  }

  /**
   * Extended Session object to include custom User fields
   * and error field for token-related issues.
   */
  interface Session {
    user: {
      id: string;
      email: string;
      roles: string[];
      userName: string;
      profileUrl: string | null;
      accessToken: string;
      refreshToken: string;
    };
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT object returned in the `jwt` callback and used in the `session` callback.
   * This represents the token's structure in your app.
   */
  interface JWT {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: "RefreshAccessTokenError";
  }
}
