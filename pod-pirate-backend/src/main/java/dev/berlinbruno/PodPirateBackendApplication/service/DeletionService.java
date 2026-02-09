package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;

/**
 * Service interface for coordinating entity deletions.
 * Handles cascading deletes and cleanup of related resources (media files, database records).
 * Used internally by other services to ensure complete and consistent deletion operations.
 */
public interface DeletionService {

    /**
     * Deletes a user and all associated data (podcasts, episodes, media files).
     */
    void deleteUser(AppUser user);

    /**
     * Deletes a podcast and all its episodes and media files.
     */
    void deletePodcast(Podcast podcast);

    /**
     * Deletes a specific episode from a podcast and its media files.
     */
    void deleteEpisode(Podcast podcast, int episodeIndex);

}
