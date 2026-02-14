import { GeneralResponse, LoginResponse, RefreshTokenResponse } from "@/types/api";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Refresh-Token": token.refreshToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token refresh failed:", response.status, errorText);
      throw new Error("Failed to refresh token");
    }

    const data: RefreshTokenResponse = await response.json();

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + 14 * 60 * 1000, // 14 minutes
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${process.env.NEXT_BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData: GeneralResponse = await response.json();
            throw new Error(errorData.code || "Authentication failed");
          }

          const data: LoginResponse = await response.json();

          // Return user object matching our NextAuth User interface
          return {
            id: data.userId,
            email: data.email,
            roles: data.roles || [],
            userName: data.userName,
            profileUrl: data.profileUrl || null,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          roles: user.roles,
          name: user.userName,
          image: user.profileUrl,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: Date.now() + 14 * 60 * 1000, // 14 minutes
        };
      }

      // Handle session updates
      if (trigger === "update" && session) {
        return {
          ...token,
          name: session.userName ?? token.name,
          image: session.profileUrl ?? token.image,
        };
      }

      // Check if token needs refresh (2 minutes before expiry)
      const shouldRefresh = Date.now() > token.expiresAt - 2 * 60 * 1000;

      if (shouldRefresh) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      // Map JWT token to session
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          roles: token.roles,
          userName: token.name || "",
          profileUrl: token.image || null,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
        error: token.error,
      };
    },
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

/**
 * Default export for NextAuth handler
 */
export default NextAuth(authOptions);
