// Authentication & Authorization Types

export interface ChangePasswordRequest {
  email: string;
  password: string;
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  userName: string;
  email: string;
  profileUrl?: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export interface RegisterResponse {
  userId: string;
  username: string;
  email: string;
  emailVerificationRequired: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SignOutRequest {
  email: string;
  password: string;
}
