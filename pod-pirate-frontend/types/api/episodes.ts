// Episode Types

type EpisodeStatus = "DRAFT" | "ARCHIVED" | "PUBLISHED";

export interface CreateEpisodeRequest {
  title: string;
  description?: string;
  durationSeconds: number;
}

export interface UpdateEpisodeRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
  durationSeconds?: number;
}

export interface EpisodeDetailResponse {
  episodeId: number;
  title: string;
  description: string;
  episodeStatus: EpisodeStatus;
  coverUrl?: string;
  audioUrl: string;
  durationSeconds: number;
  createdDate: string;
  publishedDate?: string;
  updatedDate?: string;
}

export interface EpisodePublicResponse {
  episodeId: number;
  title: string;
  description: string;
  coverUrl?: string;
  audioUrl: string;
  durationSeconds: number;
  publishedDate: string;
}
