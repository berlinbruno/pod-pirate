package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.RemoveUserRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.UpdateUserRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.UserProfileResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.creator.CreatorPublicResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.types.ImageExtension;

/**
 * Service interface for user profile operations.
 * Handles authenticated user profile management and public creator profiles.
 */
public interface AppUserService {

    // ==================== USER PROFILE MANAGEMENT ====================

    /**
     * Retrieves a user's profile by email.
     */
    UserProfileResponse getProfileByEmail(String email);

    /**
     * Updates a user's profile information.
     */
    UserProfileResponse updateProfile(String userId, UpdateUserRequest updateRequest);

    /**
     * Marks a user profile for removal (soft delete).
     */
    UserProfileResponse removeProfile(String userId, RemoveUserRequest removeRequest);

    /**
     * Generates a pre-signed URL for uploading user profile image.
     */
    ImageUploadResponse generateProfileImageUploadUrl(String email, ImageExtension extension);

    /**
     * Permanently deletes a user account using verification token.
     */
    void deleteAccount(String userId, String verificationToken);

    // ==================== PUBLIC CREATOR PROFILES ====================

    /**
     * Retrieves public profile information for a podcast creator.
     */
    CreatorPublicResponse getCreatorPublicProfile(String userId);

}
