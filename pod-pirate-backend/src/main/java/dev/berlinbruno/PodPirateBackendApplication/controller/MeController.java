package dev.berlinbruno.PodPirateBackendApplication.controller;

import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.RemoveUserRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.UpdateUserRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.UserProfileResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.*;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.AudioUploadRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.AudioUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.podcast.*;
import dev.berlinbruno.PodPirateBackendApplication.service.AppUserService;
import dev.berlinbruno.PodPirateBackendApplication.service.EpisodeService;
import dev.berlinbruno.PodPirateBackendApplication.service.PodcastService;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for authenticated user operations.
 * Provides endpoints for profile management, podcast CRUD operations, and episode management.
 * All endpoints require authentication and operate on the current user's resources.
 * User context is derived from the JWT token - no userId in paths.
 *
 * @author Pod Pirate Team
 * @version 1.0
 * @since 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(
        name = "User Profile & Content Management",
        description = "Authenticated user operations for managing profile, podcasts, and episodes. " +
                "All operations are scoped to the authenticated user. " +
                "User identity is derived from JWT token."
)
public class MeController {

    private final AppUserService appUserService;
    private final PodcastService podcastService;
    private final EpisodeService episodeService;

    // ==================== USER PROFILE ====================

    /**
     * Retrieves the authenticated user's profile information.
     *
     * @param authentication Current user's authentication context
     * @return User profile details
     */
    @Operation(
            summary = "Get current user profile",
            description = "Retrieve the authenticated user's complete profile including display name, email, " +
                    "bio, profile image, and account statistics. " +
                    "User is identified from the JWT token.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved user profile",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))
                    ),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(Authentication authentication) {
        String email = authentication.getName();
        log.info("Retrieving profile for user: {}", email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    /**
     * Updates the authenticated user's profile information.
     *
     * @param authentication Current user's authentication context
     * @param updateRequest Profile update details
     * @return Updated user profile
     */
    @Operation(
            summary = "Update current user profile",
            description = "Update the authenticated user's profile information including display name, bio, " +
                    "social links, and other profile metadata. " +
                    "Profile images must be uploaded separately via the upload URL endpoint.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Profile successfully updated",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid update data - validation failed"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PutMapping
    public ResponseEntity<UserProfileResponse> updateCurrentUserProfile(
            Authentication authentication,
            @Valid @RequestBody
            @Parameter(description = "Profile update details", required = true)
            UpdateUserRequest updateRequest
    ) {
        String email = authentication.getName();
        log.info("Updating profile for user: {}", email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        UserProfileResponse updated = appUserService.updateProfile(profile.getUserId(), updateRequest);
        return ResponseEntity.ok(updated);
    }

    /**
     * Generates a pre-signed URL for uploading a profile image.
     *
     * @param authentication Current user's authentication context
     * @param request Image upload request with file extension
     * @return Pre-signed upload URL and image path
     */
    @Operation(
            summary = "Get profile image upload URL",
            description = "Generate a pre-signed URL for uploading a profile image directly to cloud storage. " +
                    "The URL is valid for 15 minutes. " +
                    "After successful upload, the image path is automatically associated with the user profile. " +
                    "Supported formats: JPG, PNG, WebP. Max size: 5MB.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully generated upload URL",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ImageUploadResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid file extension or image type"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/profile-image/upload-url")
    public ResponseEntity<ImageUploadResponse> getProfileImageUploadUrl(
            Authentication authentication,
            @Valid @RequestBody
            @Parameter(description = "Image upload request with file extension", required = true)
            ImageUploadRequest request
    ) {
        String email = authentication.getName();
        log.info("Generating profile image upload URL for user: {}", email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        ImageUploadResponse response =
                appUserService.generateProfileImageUploadUrl(profile.getUserId(), request.getExtension());
        return ResponseEntity.ok(response);
    }

    /**
     * Removes specific fields from the user's profile.
     *
     * @param authentication Current user's authentication context
     * @param removeRequest Fields to remove from profile
     * @return Updated user profile
     */
    @Operation(
            summary = "Remove profile fields",
            description = "Remove specific optional fields from the user profile such as bio, profile image, " +
                    "or social links. This is useful for privacy or cleaning up unused fields. " +
                    "Required fields like email and display name cannot be removed.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Profile fields successfully removed",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid removal request - cannot remove required fields"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/remove")
    public ResponseEntity<UserProfileResponse> removeProfileFields(
            Authentication authentication,
            @Valid @RequestBody
            @Parameter(description = "Fields to remove from profile", required = true)
            RemoveUserRequest removeRequest
    ) {
        String email = authentication.getName();
        log.info("Removing profile fields for user: {}", email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        UserProfileResponse updated = appUserService.removeProfile(profile.getUserId(), removeRequest);
        return ResponseEntity.ok(updated);
    }

    /**
     * Permanently deletes the authenticated user's account.
     *
     * @param authentication Current user's authentication context
     * @param token Email verification token for account deletion
     */
    @Operation(
            summary = "Delete current user account",
            description = "Permanently delete the authenticated user's account and ALL associated data including " +
                    "podcasts, episodes, and media files. " +
                    "This action CANNOT be undone. " +
                    "Requires email verification token for security. " +
                    "User will be logged out immediately after deletion.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Account successfully deleted"),
                    @ApiResponse(responseCode = "400", description = "Invalid or expired verification token"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @DeleteMapping
    public ResponseEntity<Void> deleteCurrentUserAccount(
            Authentication authentication,
            @RequestParam
            @Parameter(description = "Email verification token for account deletion confirmation", required = true)
            @NotBlank String token
    ) {
        String email = authentication.getName();
        log.warn("Account deletion requested for user: {}", email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        appUserService.deleteAccount(profile.getUserId(), token);
        return ResponseEntity.noContent().build();
    }

    // ==================== USER'S PODCASTS ====================

    /**
     * Lists all podcasts created by the authenticated user with optional search and filtering.
     *
     * @param authentication Current user's authentication context
     * @param q Optional search query to filter podcasts by title
     * @param status Optional filter by podcast status
     * @param page Page number (zero-indexed)
     * @param size Number of items per page
     * @return Paginated list of user's podcasts
     */
    @Operation(
            summary = "List user's podcasts",
            description = "Retrieve all podcasts created by the authenticated user with optional search and filtering capabilities. " +
                    "Supports filtering by status (DRAFT, PUBLISHED, ARCHIVED, FLAGGED) and searching by podcast title. " +
                    "Results include basic podcast information and episode count. " +
                    "Sorted by most recently updated first.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved podcasts",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts")
    public ResponseEntity<Page<PodcastResponse>> getUserPodcasts(
            Authentication authentication,
            @RequestParam(required = false)
            @Parameter(description = "Search query to filter by podcast title (optional)")
            String q,
            @RequestParam(required = false)
            @Parameter(description = "Filter by podcast status: DRAFT, PUBLISHED, ARCHIVED, or FLAGGED (optional)")
            PodcastStatus status,
            @RequestParam(defaultValue = "0")
            @Parameter(description = "Page number (zero-indexed, default: 0)")
            @Min(0) int page,
            @RequestParam(defaultValue = "25")
            @Parameter(description = "Number of items per page (default: 25, max: 100)")
            @Min(1) @Max(100) int size
    ) {
        String email = authentication.getName();
        log.info("Retrieving podcasts for user: {}", email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);

        return ResponseEntity.ok(podcastService.getAllPodcastsForUser(profile.getUserId(), q, status, page, size));
    }

    /**
     * Creates a new podcast for the authenticated user.
     *
     * @param authentication Current user's authentication context
     * @param createRequest Podcast creation details
     * @return Created podcast with ID and initial status
     */
    @Operation(
            summary = "Create new podcast",
            description = "Create a new podcast owned by the authenticated user. " +
                    "Podcast starts in DRAFT status and must be explicitly published. " +
                    "Returns the podcast ID and resource location header. " +
                    "Images can be uploaded separately after creation.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Podcast successfully created",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PodcastDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid request - validation failed"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/podcasts")
    public ResponseEntity<PodcastDetailResponse> createPodcast(
            Authentication authentication,
            @Valid @RequestBody
            @Parameter(description = "Podcast creation details including title, description, and category", required = true)
            CreatePodcastRequest createRequest
    ) {
        String email = authentication.getName();
        log.info("Creating podcast for user: {}", email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        PodcastDetailResponse created = podcastService.createUserPodcast(profile.getUserId(), createRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Retrieves detailed information about a specific podcast.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to retrieve
     * @return Detailed podcast information
     */
    @Operation(
            summary = "Get podcast details",
            description = "Retrieve comprehensive information about a specific podcast owned by the authenticated user. " +
                    "Includes all metadata, current status, episode count, and image URLs. " +
                    "Ownership is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved podcast details",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PodcastDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to access this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}")
    public ResponseEntity<PodcastDetailResponse> getPodcastDetails(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Unique podcast identifier", required = true)
            @NotBlank String podcastId
    ) {
        String email = authentication.getName();
        log.info("Retrieving podcast {} for user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        PodcastDetailResponse details = podcastService.getUserPodcastDetails(profile.getUserId(), podcastId);
        return ResponseEntity.ok(details);
    }

    /**
     * Generates a pre-signed URL for uploading a podcast image.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to upload image for
     * @param request Image upload request with type and extension
     * @return Pre-signed upload URL and image path
     */
    @Operation(
            summary = "Get podcast image upload URL",
            description = "Generate a pre-signed URL for uploading podcast cover art or banner image. " +
                    "Supports both square cover (1:1 ratio) and wide banner (16:9 ratio). " +
                    "The URL is valid for 15 minutes. " +
                    "Ownership is automatically verified. " +
                    "Supported formats: JPG, PNG, WebP. Max size: 5MB.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully generated upload URL",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ImageUploadResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format or file extension"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to modify this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/podcasts/{podcastId}/podcast-image/upload-url")
    public ResponseEntity<ImageUploadResponse> getPodcastImageUploadUrl(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to upload image for", required = true)
            @NotBlank String podcastId,
            @Valid @RequestBody
            @Parameter(description = "Image upload request with type (COVER/BANNER) and extension", required = true)
            ImageUploadRequest request
    ) {
        String email = authentication.getName();
        log.info("Generating podcast image upload URL for podcast {} by user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        ImageUploadResponse response = podcastService.generatePodcastImageUploadUrl(
                profile.getUserId(),
                podcastId,
                request.getImageType(),
                request.getExtension()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Updates podcast metadata.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to update
     * @param updateRequest Podcast update details
     * @return Updated podcast details
     */
    @Operation(
            summary = "Update podcast metadata",
            description = "Update podcast information including title, description, category, and other metadata. " +
                    "Images must be updated separately via upload URL endpoints. " +
                    "Status changes (publish/archive) use dedicated PATCH endpoints. " +
                    "Ownership is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Podcast successfully updated",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PodcastDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format or update data - validation failed"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to modify this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PutMapping("/podcasts/{podcastId}")
    public ResponseEntity<PodcastDetailResponse> updatePodcast(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to update", required = true)
            @NotBlank String podcastId,
            @Valid @RequestBody
            @Parameter(description = "Podcast update details", required = true)
            UpdatePodcastRequest updateRequest
    ) {
        String email = authentication.getName();
        log.info("Updating podcast {} for user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        PodcastDetailResponse updated = podcastService.updateUserPodcast(profile.getUserId(), podcastId, updateRequest);
        return ResponseEntity.ok(updated);
    }

    /**
     * Publishes a podcast (changes status from DRAFT to PUBLISHED).
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to publish
     * @return Updated podcast with PUBLISHED status
     */
    @Operation(
            summary = "Publish podcast",
            description = "Change podcast status from DRAFT to PUBLISHED, making it visible in public discovery. " +
                    "Podcast must have at least one published episode and required metadata filled. " +
                    "Once published, the podcast appears in public listings and search results. " +
                    "Ownership is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Podcast successfully published",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PodcastDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format or cannot publish - missing required metadata or episodes"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to publish this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "409", description = "Podcast is already published or in invalid state"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/podcasts/{podcastId}/publish")
    public ResponseEntity<PodcastDetailResponse> publishPodcast(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to publish", required = true)
            @NotBlank String podcastId
    ) {
        String email = authentication.getName();
        log.info("Publishing podcast {} for user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        PodcastDetailResponse published = podcastService.publishUserPodcast(profile.getUserId(), podcastId);
        return ResponseEntity.ok(published);
    }

    /**
     * Archives a podcast (changes status from PUBLISHED to ARCHIVED).
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to archive
     * @return Updated podcast with ARCHIVED status
     */
    @Operation(
            summary = "Archive podcast",
            description = "Change podcast status from PUBLISHED to ARCHIVED, removing it from public discovery. " +
                    "Archived podcasts are hidden from public listings but remain accessible via direct links. " +
                    "Episodes remain in their current state. " +
                    "This action is reversible by re-publishing. " +
                    "Ownership is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Podcast successfully archived",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PodcastDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format or cannot archive - podcast is not published"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to archive this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "409", description = "Podcast is already archived or in invalid state"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/podcasts/{podcastId}/archive")
    public ResponseEntity<PodcastDetailResponse> archivePodcast(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to archive", required = true)
            @NotBlank String podcastId
    ) {
        String email = authentication.getName();
        log.info("Archiving podcast {} for user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        PodcastDetailResponse archived = podcastService.archiveUserPodcast(profile.getUserId(), podcastId);
        return ResponseEntity.ok(archived);
    }

    /**
     * Permanently deletes a podcast and all its episodes.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to delete
     */
    @Operation(
            summary = "Delete podcast",
            description = "Permanently delete a podcast and ALL its episodes and associated media files. " +
                    "This action CANNOT be undone. " +
                    "All episode audio files and images are also deleted from cloud storage. " +
                    "Ownership is automatically verified.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Podcast successfully deleted"),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to delete this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @DeleteMapping("/podcasts/{podcastId}")
    public ResponseEntity<Void> deletePodcast(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to delete", required = true)
            @NotBlank String podcastId
    ) {
        String email = authentication.getName();
        log.warn("Deleting podcast {} for user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        podcastService.deleteUserPodcast(profile.getUserId(), podcastId);
        return ResponseEntity.noContent().build();
    }

    // ==================== USER'S EPISODES ====================

    /**
     * Lists all episodes for a specific podcast.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to retrieve episodes from
     * @return List of episodes (all statuses) ordered by episode number
     */
    @Operation(
            summary = "List podcast episodes",
            description = "Retrieve all episodes for a user's podcast regardless of status (DRAFT, PUBLISHED, ARCHIVED). " +
                    "Episodes are ordered by episode number (ascending). " +
                    "Includes basic episode information and audio file metadata. " +
                    "Ownership of parent podcast is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved episodes",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodeDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to access this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}/episodes")
    public ResponseEntity<List<EpisodeDetailResponse>> getPodcastEpisodes(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to retrieve episodes from", required = true)
            @NotBlank String podcastId
    ) {
        String email = authentication.getName();
        log.info("Retrieving episodes for podcast {} by user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        List<EpisodeDetailResponse> episodes = episodeService.getUserPodcastEpisodes(profile.getUserId(), podcastId);
        return ResponseEntity.ok(episodes);
    }

    /**
     * Creates a new episode for a podcast.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID to create episode for
     * @param createRequest Episode creation details
     * @return Created episode with ID and initial status
     */
    @Operation(
            summary = "Create new episode",
            description = "Create a new episode for a podcast owned by the authenticated user. " +
                    "Episode starts in DRAFT status and must be explicitly published. " +
                    "Returns the episode ID and resource location. " +
                    "Audio and images must be uploaded separately after creation. " +
                    "Ownership of parent podcast is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Episode successfully created",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodeDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format or request data - validation failed"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to create episodes for this podcast - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/podcasts/{podcastId}/episodes")
    public ResponseEntity<EpisodeDetailResponse> createEpisode(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to create episode for", required = true)
            @NotBlank String podcastId,
            @Valid @RequestBody
            @Parameter(description = "Episode creation details including title, description, and episode number", required = true)
            CreateEpisodeRequest createRequest
    ) {
        String email = authentication.getName();
        log.info("Creating episode for podcast {} by user: {}", podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        EpisodeDetailResponse created = episodeService.createUserEpisode(profile.getUserId(), podcastId, createRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Retrieves detailed information about a specific episode.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to retrieve
     * @return Detailed episode information
     */
    @Operation(
            summary = "Get episode details",
            description = "Retrieve comprehensive information about a specific episode including " +
                    "title, description, audio metadata, publication date, and image URLs. " +
                    "Ownership of parent podcast is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved episode details",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodeDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast or episode ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to access this episode - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}/episodes/{episodeId}")
    public ResponseEntity<EpisodeDetailResponse> getEpisodeDetails(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to retrieve", required = true)
            @Min(0) Long episodeId
    ) {
        String email = authentication.getName();
        log.info("Retrieving episode {} from podcast {} for user: {}", episodeId, podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        EpisodeDetailResponse details = episodeService.getUserEpisodeDetails(profile.getUserId(), podcastId, episodeId);
        return ResponseEntity.ok(details);
    }

    /**
     * Generates a pre-signed URL for uploading an episode image.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to upload image for
     * @param request Image upload request with type and extension
     * @return Pre-signed upload URL and image path
     */
    @Operation(
            summary = "Get episode image upload URL",
            description = "Generate a pre-signed URL for uploading episode cover art or thumbnail. " +
                    "The URL is valid for 15 minutes. " +
                    "Ownership of parent podcast is automatically verified. " +
                    "Supported formats: JPG, PNG, WebP. Max size: 5MB.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully generated upload URL",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ImageUploadResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast/episode ID format or file extension"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to modify this episode - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/podcasts/{podcastId}/episodes/{episodeId}/episode-image/upload-url")
    public ResponseEntity<ImageUploadResponse> getEpisodeImageUploadUrl(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to upload image for", required = true)
            @Min(0) Long episodeId,
            @Valid @RequestBody
            @Parameter(description = "Image upload request with type and extension", required = true)
            ImageUploadRequest request
    ) {
        String email = authentication.getName();
        log.info("Generating episode image upload URL for episode {} in podcast {} by user: {}", episodeId, podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        ImageUploadResponse response = episodeService.generateEpisodeImageUploadUrl(
                profile.getUserId(),
                podcastId,
                episodeId,
                request.getImageType(),
                request.getExtension()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Generates a pre-signed URL for uploading episode audio.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to upload audio for
     * @param request Audio upload request with type and extension
     * @return Pre-signed upload URL and audio path
     */
    @Operation(
            summary = "Get episode audio upload URL",
            description = "Generate a pre-signed URL for uploading episode audio file directly to cloud storage. " +
                    "The URL is valid for 30 minutes due to larger file sizes. " +
                    "After upload, audio metadata (duration, bitrate) is automatically extracted. " +
                    "Ownership of parent podcast is automatically verified. " +
                    "Supported formats: MP3, M4A, AAC, WAV. Max size: 500MB.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully generated upload URL",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AudioUploadResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast/episode ID format or file extension"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to modify this episode - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/podcasts/{podcastId}/episodes/{episodeId}/episode-audio/upload-url")
    public ResponseEntity<AudioUploadResponse> getEpisodeAudioUploadUrl(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to upload audio for", required = true)
            @Min(0) Long episodeId,
            @Valid @RequestBody
            @Parameter(description = "Audio upload request with type and extension", required = true)
            AudioUploadRequest request
    ) {
        String email = authentication.getName();
        log.info("Generating episode audio upload URL for episode {} in podcast {} by user: {}", episodeId, podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        AudioUploadResponse response = episodeService.generateEpisodeAudioUploadUrl(
                profile.getUserId(),
                podcastId,
                episodeId,
                request.getAudioType(),
                request.getExtension()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Updates episode metadata.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to update
     * @param updateRequest Episode update details
     * @return Updated episode details
     */
    @Operation(
            summary = "Update episode metadata",
            description = "Update episode information including title, description, episode number, and other metadata. " +
                    "Audio and images must be updated separately via upload URL endpoints. " +
                    "Status changes (publish/archive) use dedicated PATCH endpoints. " +
                    "Ownership of parent podcast is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Episode successfully updated",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodeDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast/episode ID format or update data - validation failed"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to modify this episode - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PutMapping("/podcasts/{podcastId}/episodes/{episodeId}")
    public ResponseEntity<EpisodeDetailResponse> updateEpisode(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to update", required = true)
            @Min(0) Long episodeId,
            @Valid @RequestBody
            @Parameter(description = "Episode update details", required = true)
            UpdateEpisodeRequest updateRequest
    ) {
        String email = authentication.getName();
        log.info("Updating episode {} in podcast {} for user: {}", episodeId, podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        EpisodeDetailResponse updated = episodeService.updateUserEpisode(profile.getUserId(), podcastId, episodeId, updateRequest);
        return ResponseEntity.ok(updated);
    }

    /**
     * Publishes an episode (changes status from DRAFT to PUBLISHED).
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to publish
     * @return Updated episode with PUBLISHED status
     */
    @Operation(
            summary = "Publish episode",
            description = "Change episode status from DRAFT to PUBLISHED, making it visible to the public. " +
                    "Episode must have audio file uploaded and required metadata filled. " +
                    "Published episodes appear in podcast feeds and public episode lists. " +
                    "Ownership of parent podcast is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Episode successfully published",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodeDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast/episode ID format or cannot publish - missing audio file or required metadata"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to publish this episode - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "409", description = "Episode is already published or in invalid state"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/podcasts/{podcastId}/episodes/{episodeId}/publish")
    public ResponseEntity<EpisodeDetailResponse> publishEpisode(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to publish", required = true)
            @Min(0) Long episodeId
    ) {
        String email = authentication.getName();
        log.info("Publishing episode {} in podcast {} for user: {}", episodeId, podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        EpisodeDetailResponse published = episodeService.publishUserEpisode(profile.getUserId(), podcastId, episodeId);
        return ResponseEntity.ok(published);
    }

    /**
     * Archives an episode (changes status from PUBLISHED to ARCHIVED).
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to archive
     * @return Updated episode with ARCHIVED status
     */
    @Operation(
            summary = "Archive episode",
            description = "Change episode status from PUBLISHED to ARCHIVED, hiding it from public feeds. " +
                    "Archived episodes remain accessible via direct links but don't appear in podcast feeds. " +
                    "This action is reversible by re-publishing. " +
                    "Ownership of parent podcast is automatically verified.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Episode successfully archived",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodeDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast/episode ID format or cannot archive - episode is not published"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to archive this episode - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "409", description = "Episode is already archived or in invalid state"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/podcasts/{podcastId}/episodes/{episodeId}/archive")
    public ResponseEntity<EpisodeDetailResponse> archiveEpisode(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to archive", required = true)
            @Min(0) Long episodeId
    ) {
        String email = authentication.getName();
        log.info("Archiving episode {} in podcast {} for user: {}", episodeId, podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        EpisodeDetailResponse archived = episodeService.archiveUserEpisode(profile.getUserId(), podcastId, episodeId);
        return ResponseEntity.ok(archived);
    }

    /**
     * Permanently deletes an episode.
     *
     * @param authentication Current user's authentication context
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to delete
     */
    @Operation(
            summary = "Delete episode",
            description = "Permanently delete an episode and its associated audio file and images from cloud storage. " +
                    "This action CANNOT be undone. " +
                    "Episode numbers are not automatically adjusted - gaps may remain in episode numbering. " +
                    "Ownership of parent podcast is automatically verified.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Episode successfully deleted"),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast or episode ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required - invalid or missing token"),
                    @ApiResponse(responseCode = "403", description = "Not authorized to delete this episode - ownership verification failed"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @DeleteMapping("/podcasts/{podcastId}/episodes/{episodeId}")
    public ResponseEntity<Void> deleteEpisode(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to delete", required = true)
            @Min(0) Long episodeId
    ) {
        String email = authentication.getName();
        log.warn("Deleting episode {} from podcast {} for user: {}", episodeId, podcastId, email);
        UserProfileResponse profile = appUserService.getProfileByEmail(email);
        episodeService.deleteUserEpisode(profile.getUserId(), podcastId, episodeId);
        return ResponseEntity.noContent().build();
    }
}
