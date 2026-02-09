// User Profiles & Creators Types

export interface CreatorPublicResponse {
  creatorId: string;
  creatorName: string;
  bio?: string;
  profileUrl?: string;
  podcastCount?: number;
  joinedDate: string;
}

export interface RemoveUserRequest {
  bio: boolean;
  profileUrl: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  bio?: string;
  profileUrl?: string;
}

export interface UserProfileResponse {
  userId: string;
  username: string;
  email: string;
  bio?: string;
  profileUrl?: string;
  podcastCount: number;
  joinedDate: string;
  lastLoginDate: string;
  updatedDate: string;
  roles: string[];
}
