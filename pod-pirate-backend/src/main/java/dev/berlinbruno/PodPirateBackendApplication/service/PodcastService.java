package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.podcast.*;
import dev.berlinbruno.PodPirateBackendApplication.types.ImageExtension;
import dev.berlinbruno.PodPirateBackendApplication.types.ImageType;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import org.springframework.data.domain.Page;

/**
 * Service interface for podcast operations.
 * Handles user podcast management and public podcast discovery.
 */
public interface PodcastService {

    // ==================== USER PODCAST MANAGEMENT ====================

    /**
     * Retrieves all podcasts created by a user with optional search and filtering.
     */
    Page<PodcastResponse> getAllPodcastsForUser(String id, String q, PodcastStatus status, int page, int size);

    /**
     * Gets detailed information about a user's podcast.
     */
    PodcastDetailResponse getUserPodcastDetails(String id, String podcastId);

    /**
     * Creates a new podcast for a user.
     */
    PodcastDetailResponse createUserPodcast(String id, CreatePodcastRequest createRequest);

    /**
     * Updates a user's podcast metadata.
     */
    PodcastDetailResponse updateUserPodcast(String id, String podcastId, UpdatePodcastRequest updateRequest);

    /**
     * Generates a pre-signed URL for uploading podcast images.
     */
    ImageUploadResponse generatePodcastImageUploadUrl(String userId, String podcastId, ImageType imageType, ImageExtension extension);

    /**
     * Publishes a user's podcast.
     */
    PodcastDetailResponse publishUserPodcast(String id, String podcastId);

    /**
     * Archives a user's podcast.
     */
    PodcastDetailResponse archiveUserPodcast(String id, String podcastId);

    /**
     * Deletes a user's podcast.
     */
    void deleteUserPodcast(String id, String podcastId);

    // ==================== PUBLIC PODCAST DISCOVERY ====================

    /**
     * Retrieves all published podcasts with optional search and filtering.
     */
    Page<PodcastPublicResponse> getAllPublishedPodcasts(String query, String category, int page, int size);

    /**
     * Gets detailed information about a published podcast.
     */
    PodcastPublicDetailResponse getPublishedPodcastDetailsById(String podcastId);

    /**
     * Retrieves all published podcasts by a specific creator.
     */
    Page<PodcastPublicResponse> getPublishedPodcastsByCreator(String id, int page, int size);


}
