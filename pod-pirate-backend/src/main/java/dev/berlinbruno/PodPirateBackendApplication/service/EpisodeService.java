package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.dto.episode.*;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.AudioUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.types.AudioExtension;
import dev.berlinbruno.PodPirateBackendApplication.types.AudioType;
import dev.berlinbruno.PodPirateBackendApplication.types.ImageExtension;
import dev.berlinbruno.PodPirateBackendApplication.types.ImageType;

import java.util.List;

/**
 * Service interface for episode operations.
 * Handles user episode management and public episode discovery.
 */
public interface EpisodeService {

    // ==================== PUBLIC EPISODE DISCOVERY ====================

    /**
     * Retrieves all published episodes for a podcast.
     */
    List<EpisodePublicDetailResponse> getAllPublishedEpisodes(String podcastId);

    /**
     * Gets detailed information about a published episode.
     */
    EpisodePublicDetailResponse getPublishedEpisodeDetails(String podcastId, Long episodeId);

    // ==================== USER EPISODE MANAGEMENT ====================

    /**
     * Retrieves all episodes for a user's podcast.
     */
    List<EpisodeDetailResponse> getUserPodcastEpisodes(String userId, String podcastId);

    /**
     * Creates a new episode for a user's podcast.
     */
    EpisodeDetailResponse createUserEpisode(String userId, String podcastId, CreateEpisodeRequest createRequest);

    /**
     * Gets detailed information about a user's episode.
     */
    EpisodeDetailResponse getUserEpisodeDetails(String userId, String podcastId, Long episodeId);

    /**
     * Updates a user's episode metadata.
     */
    EpisodeDetailResponse updateUserEpisode(String userId, String podcastId, Long episodeId, UpdateEpisodeRequest updateRequest);

    /**
     * Publishes a user's episode.
     */
    EpisodeDetailResponse publishUserEpisode(String userId, String podcastId, Long episodeId);

    /**
     * Archives a user's episode.
     */
    EpisodeDetailResponse archiveUserEpisode(String userId, String podcastId, Long episodeId);

    /**
     * Deletes a user's episode.
     */
    void deleteUserEpisode(String userId, String podcastId, Long episodeId);

    /**
     * Generates a pre-signed URL for uploading episode images.
     */
    ImageUploadResponse generateEpisodeImageUploadUrl(String id, String podcastId, Long episodeId, ImageType imageType, ImageExtension extension);

    /**
     * Generates a pre-signed URL for uploading episode audio.
     */
    AudioUploadResponse generateEpisodeAudioUploadUrl(String id, String podcastId, Long episodeId, AudioType audioType, AudioExtension extension);

}
