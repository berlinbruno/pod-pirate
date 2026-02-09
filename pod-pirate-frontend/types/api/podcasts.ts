// Podcast Types

type PodcastStatus = "DRAFT" | "ARCHIVED" | "PUBLISHED" | "FLAGGED";

export interface CreatePodcastRequest {
  title: string;
  description: string;
  category: string;
}

export interface UpdatePodcastRequest {
  title?: string;
  description?: string;
  coverUrl?: string;
  bannerUrl?: string;
  category?: string;
}

export interface PodcastResponse {
  podcastId: string;
  title: string;
  category: string;
  coverUrl: string;
  podcastStatus: PodcastStatus;
  isFlagged: boolean;
  episodeCount: number;
  publishedDate: string;
  lastEpisodeDate: string;
}

export interface PodcastDetailResponse {
  podcastId: string;
  title: string;
  description: string;
  category: string;
  bannerUrl: string;
  coverUrl: string;
  podcastStatus: PodcastStatus;
  episodeCount: number;
  createdDate: string;
  updatedDate: string;
  publishedDate: string;
  lastEpisodeDate: string;
  isFlagged: boolean;
}

export interface PodcastPublicResponse {
  podcastId: string;
  title: string;
  description: string;
  category: string;
  coverUrl: string;
  bannerUrl: string;
  creatorId: string;
  creatorName: string;
  episodeCount: number;
  publishedDate: string;
  lastEpisodeDate: string;
}

export interface PodcastPublicDetailResponse {
  podcastId: string;
  title: string;
  description: string;
  category: string;
  coverUrl: string;
  bannerUrl: string;
  creatorName: string;
  creatorBio: string;
  creatorId: string;
  episodeCount: number;
  publishedDate: string;
  lastEpisodeDate: string;
}

export interface PodcastSummary {
  podcastId: string;
  title: string;
  episodeCount: number;
  createdAt: string;
}
