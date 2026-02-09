package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminPodcastDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminPodcastResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminUserDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminUserResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodeDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.types.AccountRoles;
import dev.berlinbruno.PodPirateBackendApplication.types.AccountStatus;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Service interface for administrative operations.
 * Handles user management, podcast moderation, and episode moderation.
 * All methods require ADMIN role authorization.
 */
public interface AdminService {

    // ==================== USER MANAGEMENT ====================

    /**
     * Retrieves all users with optional search and filtering.
     */
    Page<AdminUserResponse> getAllUsers(String q, AccountRoles roles, AccountStatus status, int page, int size);

    /**
     * Gets detailed information about a specific user.
     */
    AdminUserDetailResponse getUserDetailById(String userId);

    /**
     * Locks a user account to prevent login.
     */
    void lockUser(String userId);

    /**
     * Unlocks a previously locked user account.
     */
    void unlockUser(String userId);

    /**
     * Permanently deletes a user account and all associated data.
     */
    void deleteUserAccount(String userId);

    // ==================== PODCAST MODERATION ====================

    /**
     * Retrieves all podcasts with optional search and filtering.
     */
    Page<AdminPodcastResponse> getAllPodcasts(String query, PodcastStatus status, int page, int size);

    /**
     * Gets detailed information about a specific podcast for admin review.
     */
    AdminPodcastDetailResponse getPodcastDetails(String podcastId);

    /**
     * Flags a podcast for content review.
     */
    void flagPodcast(String podcastId);

    /**
     * Removes flag from a podcast after review.
     */
    void unflagPodcast(String podcastId);

    /**
     * Permanently deletes a podcast and all its episodes.
     */
    void deletePodcast(String podcastId);

    // ==================== EPISODE MODERATION ====================

    /**
     * Retrieves all episodes for a specific podcast.
     */
    List<EpisodeDetailResponse> getPodcastEpisodes(String podcastId);

    /**
     * Permanently deletes a specific episode.
     */
    void deleteEpisode(String podcastId, Long episodeId);

}
