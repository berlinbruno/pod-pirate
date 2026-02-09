/**
 * API Types Index
 *
 * Centralized export for all API request/response types.
 * Types are organized by domain and match the OpenAPI specification.
 *
 * Usage:
 * - Import specific types: import { LoginRequest, LoginResponse } from '@/types/api';
 * - Import from domain: import { LoginRequest } from '@/types/api/authentication';
 */

// Authentication & Authorization
export * from "./authentication";

// User Profiles & Creators
export * from "./profiles";

// Podcasts
export * from "./podcasts";

// Episodes
export * from "./episodes";

// File Uploads
export * from "./uploads";

// Admin Management
export * from "./admin";

// Pagination
export * from "./pagination";

// Common Response Types
export * from "./responses";
