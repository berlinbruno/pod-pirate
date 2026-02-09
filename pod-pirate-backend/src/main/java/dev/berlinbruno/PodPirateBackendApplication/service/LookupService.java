package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.types.AccountRoles;
import dev.berlinbruno.PodPirateBackendApplication.types.EpisodeStatus;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import org.springframework.data.domain.Page;

import java.util.Date;

/**
 * Service interface for entity lookups and retrieval operations.
 * Used internally by other services to fetch entities with proper validation.
 * Throws appropriate exceptions when entities are not found or access is denied.
 */
public interface LookupService {

    // ==================== ENTITY RETRIEVAL ====================

    /**
     * Retrieves a podcast by ID (any status).
     * @throws PodcastNotFoundException if podcast not found
     */
    Podcast getPodcastById(String podcastId);

    /**
     * Retrieves a published podcast by ID (PUBLISHED status only).
     * @throws PodcastNotFoundException if podcast not found or not published
     */
    Podcast getPublishedPodcastById(String podcastId);

    /**
     * Retrieves a user by ID.
     * @throws UserNotFoundException if user not found
     */
    AppUser getById(String userId);

    /**
     * Retrieves a user by email address.
     * @throws UserNotFoundException if user not found
     */
    AppUser getByEmail(String email);

    // ==================== SEARCH OPERATIONS ====================

    /**
     * Searches podcasts with comprehensive filtering options.
     * Used by admin operations for advanced podcast search.
     */
    Page<Podcast> searchPodcasts(
            String userId,
            String category,
            Boolean flagged,
            PodcastStatus podcastStatus,
            EpisodeStatus episodeStatus,
            String keyword,
            Date publishedFrom,
            Date publishedTo,
            int page,
            int size
    );

    /**
     * Searches users with comprehensive filtering options.
     * Used by admin operations for user management.
     */
    Page<AppUser> searchUsers(
            AccountRoles roles,
            Boolean isLocked,
            Boolean isEmailVerified,
            String keyword,
            Date joinedFrom,
            Date joinedTo,
            int page,
            int size
    );

}
