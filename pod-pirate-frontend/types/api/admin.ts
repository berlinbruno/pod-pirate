// Admin Management Types

import type { PodcastSummary } from "./podcasts";

type PodcastStatus = "DRAFT" | "ARCHIVED" | "PUBLISHED" | "FLAGGED";

export interface AdminPodcastResponse {
  podcastId: string;
  title: string;
  category: string;
  coverUrl: string;
  podcastStatus: PodcastStatus;
  isFlagged: boolean;
  creatorId: string;
  creatorName: string;
  episodeCount: number;
  createdDate: string;
  publishedDate: string;
  lastEpisodeDate: string;
}

export interface AdminPodcastDetailResponse {
  podcastId: string;
  title: string;
  description: string;
  category: string;
  coverUrl: string;
  bannerUrl: string;
  podcastStatus: PodcastStatus;
  isFlagged: boolean;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  episodeCount: number;
  createdDate: string;
  publishedDate: string;
  updatedDate: string;
  lastEpisodeDate: string;
}

export interface AdminUserDetailResponse {
  userId: string;
  username: string;
  email: string;
  bio: string;
  profileUrl: string;
  isLocked: boolean;
  isEmailVerified: boolean;
  roles: string[];
  createdDate: string;
  updatedDate: string;
  lastLoginDate: string;
  podcastCount: number;
  totalEpisodeCount: number;
  recentPodcasts: PodcastSummary[];
}

export interface AdminUserResponse {
  userId: string;
  username: string;
  email: string;
  profileUrl?: string;
  isLocked: boolean;
  isEmailVerified: boolean;
  roles: string[];
  podcastCount: number;
  createdDate: string;
  lastLoginDate: string;
}
