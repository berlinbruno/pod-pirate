// Common Response Types

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface GeneralResponse {
  httpStatus: string;
  code: string;
  message: string;
  details: string;
}
