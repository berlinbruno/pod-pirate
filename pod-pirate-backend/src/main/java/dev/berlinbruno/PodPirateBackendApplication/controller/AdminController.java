package dev.berlinbruno.PodPirateBackendApplication.controller;

import dev.berlinbruno.PodPirateBackendApplication.dto.admin.*;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodeDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.service.AdminService;
import dev.berlinbruno.PodPirateBackendApplication.types.AccountRoles;
import dev.berlinbruno.PodPirateBackendApplication.types.AccountStatus;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for administrative operations.
 * Provides endpoints for user management, content moderation, and audit logging.
 * All endpoints require ADMIN authority.
 *
 * @author Pod Pirate Team
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasAuthority('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(
        name = "Admin Management",
        description = "Administrative endpoints for user management, content moderation, and audit logging. " +
                "All operations require ADMIN authority and are logged for compliance."
)
public class AdminController {

    private final AdminService adminService;

    // ==================== USER MANAGEMENT ====================

    /**
     * Retrieves a paginated list of all users with optional search and filtering.
     *
     * @param q Optional search query to filter users by username or email
     * @param status Optional filter by account status (ACTIVE, LOCKED, PENDING_VERIFICATION)
     * @param roles Optional filter by account role (USER, ADMIN, CREATOR)
     * @param page Page number (zero-indexed)
     * @param size Number of items per page
     * @return Paginated list of users with basic information
     */
    @Operation(
            summary = "List all users",
            description = "Retrieves a paginated list of all users with optional search and filtering capabilities. " +
                    "Supports filtering by account status, role, and searching by username/email. " +
                    "Results include user information such as username, email, profile URL, roles, lock status, " +
                    "verification status, timestamps, and podcast count. Sensitive data like passwords are excluded.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved list of users",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid parameters (e.g., search query too short, invalid pagination values)"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponse>> listUsers(
            @RequestParam(required = false)
            @Parameter(description = "Search query to filter by username or email (optional)")
            String q,
            @RequestParam(required = false)
            @Parameter(description = "Filter by account status: ACTIVE, LOCKED, or PENDING_VERIFICATION (optional)")
            AccountStatus status,
            @RequestParam(required = false)
            @Parameter(description = "Filter by account role: USER, ADMIN, or CREATOR (optional)")
            AccountRoles roles,
            @RequestParam(defaultValue = "0")
            @Parameter(description = "Page number (zero-indexed, default: 0)")
            @Min(0) int page,
            @RequestParam(defaultValue = "25")
            @Parameter(description = "Number of items per page (default: 25, max: 100)")
            @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(adminService.getAllUsers(q, roles, status, page, size));
    }

    /**
     * Retrieves detailed information about a specific user.
     *
     * @param userId User ID to retrieve
     * @return Detailed user information including account status, roles, timestamps, and podcast count
     */
    @Operation(
            summary = "Get user details",
            description = "Retrieve comprehensive information about a specific user including account status, " +
                    "registration date, last login time, email verification status, lock status, assigned roles, " +
                    "podcast count, and other relevant account details. Sensitive data like passwords are excluded.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved user details",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AdminUserDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserDetailResponse> getUserDetails(
            @PathVariable
            @Parameter(description = "Unique user identifier", required = true)
            String userId
    ) {
        return ResponseEntity.ok(adminService.getUserDetailById(userId));
    }

    /**
     * Locks a user account to prevent login and activity.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param userId User ID to lock
     * @return No content on success
     */
    @Operation(
            summary = "Lock user account",
            description = "Locks a user account to prevent login and all platform activity. " +
                    "This action is reversible and is logged for audit purposes. " +
                    "The user will not be able to access their account until unlocked by an admin.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "User account successfully locked"),
                    @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "409", description = "Account is already locked"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/users/{userId}/lock")
    public ResponseEntity<Void> lockUserAccount(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "User ID of the account to lock", required = true)
            String userId
    ) {
        adminService.lockUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Unlocks a previously locked user account.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param userId User ID to unlock
     * @return No content on success
     */
    @Operation(
            summary = "Unlock user account",
            description = "Unlocks a previously locked user account, restoring full platform access. " +
                    "This action is logged for audit purposes.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "User account successfully unlocked"),
                    @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "409", description = "Account is not currently locked"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/users/{userId}/unlock")
    public ResponseEntity<Void> unlockUserAccount(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "User ID of the account to unlock", required = true)
            String userId
    ) {
        adminService.unlockUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Permanently deletes a user account and all associated data.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param userId User ID to delete
     * @return No content on success
     */
    @Operation(
            summary = "Delete user account",
            description = "Permanently deletes a user account and ALL associated data including podcasts, episodes, and media files. " +
                    "This action CANNOT be undone and is logged for audit purposes. " +
                    "Use with extreme caution.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "User account successfully deleted"),
                    @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUserAccount(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "User ID of the account to delete", required = true)
            String userId
    ) {
        adminService.deleteUserAccount(userId);
        return ResponseEntity.noContent().build();
    }

    // ==================== PODCAST MODERATION ====================

    /**
     * Retrieves a paginated list of podcasts with optional search and filtering.
     *
     * @param q Optional search query to filter podcasts by title
     * @param status Optional filter by podcast status
     * @param page Page number (zero-indexed)
     * @param size Number of items per page
     * @return Paginated list of podcasts
     */
    @Operation(
            summary = "List all podcasts",
            description = "Retrieves a paginated list of all podcasts across the platform with optional search and filtering capabilities. " +
                    "Supports filtering by status (DRAFT, PUBLISHED, ARCHIVED, FLAGGED) and searching by podcast title. " +
                    "Includes creator information and episode count.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved list of podcasts",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid status parameter or pagination values"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts")
    public ResponseEntity<Page<AdminPodcastResponse>> listPodcasts(
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
        return ResponseEntity.ok(adminService.getAllPodcasts(q, status, page, size));
    }

    /**
     * Retrieves detailed information about a specific podcast.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param podcastId Podcast ID to retrieve
     * @return Detailed podcast information
     */
    @Operation(
            summary = "Get podcast details",
            description = "Retrieve comprehensive information about a specific podcast including all episodes, " +
                    "creator details, moderation status, and analytics.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved podcast details",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AdminPodcastDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}")
    public ResponseEntity<AdminPodcastDetailResponse> getPodcastDetails(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Unique podcast identifier", required = true)
            String podcastId
    ) {
        return ResponseEntity.ok(adminService.getPodcastDetails(podcastId));
    }

    /**
     * Flags a podcast for moderation review.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param podcastId Podcast ID to flag
     * @return No content on success
     */
    @Operation(
            summary = "Flag podcast for review",
            description = "Marks a podcast as flagged for content moderation review. " +
                    "Flagged podcasts may be hidden from public discovery pending review. " +
                    "This action is logged for audit purposes.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Podcast successfully flagged"),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "409", description = "Podcast is already flagged"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/podcasts/{podcastId}/flag")
    public ResponseEntity<Void> flagPodcast(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to flag", required = true)
            String podcastId
    ) {
        adminService.flagPodcast(podcastId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Removes the flagged status from a podcast.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param podcastId Podcast ID to unflag
     * @return No content on success
     */
    @Operation(
            summary = "Unflag podcast",
            description = "Removes the flagged status from a podcast after moderation review. " +
                    "The podcast will return to its previous status. " +
                    "This action is logged for audit purposes.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Podcast successfully unflagged"),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "409", description = "Podcast is not currently flagged"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PatchMapping("/podcasts/{podcastId}/unflag")
    public ResponseEntity<Void> unflagPodcast(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to unflag", required = true)
            String podcastId
    ) {
        adminService.unflagPodcast(podcastId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Permanently deletes a podcast and all its episodes.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param podcastId Podcast ID to delete
     * @param reason Optional reason for deletion (reserved for future audit logging)
     * @return No content on success
     */
    @Operation(
            summary = "Delete podcast",
            description = "Permanently deletes a podcast and ALL its episodes and associated media files. " +
                    "This action CANNOT be undone and is logged for audit purposes. " +
                    "The creator will be notified of the deletion.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Podcast successfully deleted"),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @DeleteMapping("/podcasts/{podcastId}")
    public ResponseEntity<Void> deletePodcast(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to delete", required = true)
            String podcastId,
            @RequestBody(required = false)
            @Parameter(description = "Reason for deletion (optional, for audit log)")
            String reason
    ) {
        adminService.deletePodcast(podcastId);
        return ResponseEntity.noContent().build();
    }

    // ==================== EPISODE MODERATION ====================

    /**
     * Retrieves all episodes for a specific podcast.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param podcastId Podcast ID containing the episodes
     * @return List of episodes
     */
    @Operation(
            summary = "List podcast episodes",
            description = "Retrieve all episodes for a specific podcast regardless of status. " +
                    "Includes draft and archived episodes for moderation purposes.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved episodes",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodeDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}/episodes")
    public ResponseEntity<List<EpisodeDetailResponse>> getPodcastEpisodes(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID to retrieve episodes from", required = true)
            String podcastId
    ) {
        return ResponseEntity.ok(adminService.getPodcastEpisodes(podcastId));
    }

    /**
     * Permanently deletes a specific episode.
     *
     * @param authentication Current admin's authentication (reserved for future audit logging)
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to delete
     * @return No content on success
     */
    @Operation(
            summary = "Delete episode",
            description = "Permanently deletes a specific episode and its associated media files. " +
                    "This action CANNOT be undone and is logged for audit purposes. " +
                    "The podcast creator will be notified of the deletion.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Episode successfully deleted"),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast or episode ID format"),
                    @ApiResponse(responseCode = "401", description = "Authentication required"),
                    @ApiResponse(responseCode = "403", description = "Admin authority required"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @DeleteMapping("/podcasts/{podcastId}/episodes/{episodeId}")
    public ResponseEntity<Void> deleteEpisode(
            Authentication authentication,
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to delete", required = true)
            Long episodeId
    ) {
        adminService.deleteEpisode(podcastId, episodeId);
        return ResponseEntity.noContent().build();
    }
}
