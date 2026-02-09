// File Upload Types

export interface AudioUploadRequest {
  extension: "MP3" | "WAV" | "AAC" | "FLAC" | "OGG";
  audioType: "EPISODE_AUDIO";
}

export interface AudioUploadResponse {
  blobPath: string;
  uploadUrl: string;
}

export interface ImageUploadRequest {
  extension: "JPG" | "PNG" | "WEBP";
  imageType: "PROFILE_PICTURE" | "PODCAST_COVER" | "PODCAST_BANNER" | "EPISODE_THUMBNAIL";
}

export interface ImageUploadResponse {
  uploadUrl: string;
  blobPath: string;
}
