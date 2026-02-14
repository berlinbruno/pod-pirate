package dev.berlinbruno.PodPirateBackendApplication.controller;

import dev.berlinbruno.PodPirateBackendApplication.dto.creator.CreatorPublicResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodePublicDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.podcast.PodcastPublicDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.podcast.PodcastPublicResponse;
import dev.berlinbruno.PodPirateBackendApplication.service.AppUserService;
import dev.berlinbruno.PodPirateBackendApplication.service.EpisodeService;
import dev.berlinbruno.PodPirateBackendApplication.service.PodcastService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for public content discovery.
 * Provides unauthenticated access to published podcasts, episodes, and creator profiles.
 * All data excludes sensitive information and only shows published content.
 *
 * @author Pod Pirate Team
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Validated
@Tag(
        name = "Public Discovery",
        description = "Public endpoints for discovering published podcasts, episodes, and creator profiles. " +
                "No authentication required. Only published content is visible."
)
public class PublicController {

    private final EpisodeService episodeService;
    private final PodcastService podcastService;
    private final AppUserService appUserService;

    // ==================== PODCAST DISCOVERY ====================

    /**
     * Discovers all published podcasts with optional search and category filtering.
     *
     * @param q Optional search query to filter podcasts by title
     * @param category Optional category filter
     * @param page Page number (zero-indexed)
     * @param size Number of items per page
     * @return Paginated list of published podcasts
     */
    @Operation(
            summary = "Discover published podcasts",
            description = "Browse all published podcasts on the platform with optional search and filtering capabilities. " +
                    "Supports searching by podcast title and filtering by category. " +
                    "Only returns PUBLISHED podcasts - drafts, archived, and flagged podcasts are excluded. " +
                    "Results are sorted by latest publication date. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved published podcasts",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid category or pagination parameters"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts")
    public ResponseEntity<Page<PodcastPublicResponse>> discoverPublishedPodcasts(
            @RequestParam(required = false)
            @Parameter(description = "Search query to filter by podcast title (optional)")
            String q,
            @RequestParam(required = false)
            @Parameter(description = "Filter by podcast category: e.g., Technology, Arts, Business, Comedy, Education (optional)")
            String category,
            @RequestParam(defaultValue = "0")
            @Parameter(description = "Page number (zero-indexed, default: 0)")
            @Min(0) int page,
            @RequestParam(defaultValue = "25")
            @Parameter(description = "Number of items per page (default: 25, max: 100)")
            @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(podcastService.getAllPublishedPodcasts(q,category,page, size));
    }

    /**
     * Retrieves detailed information about a published podcast.
     *
     * @param podcastId Podcast ID to retrieve
     * @return Published podcast details
     */
    @Operation(
            summary = "Get published podcast details",
            description = "Retrieve comprehensive information about a specific published podcast including " +
                    "description, creator info, episode count, category, and cover images. " +
                    "Only accessible if podcast status is PUBLISHED. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved podcast details",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = PodcastPublicDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found or not published"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}")
    public ResponseEntity<PodcastPublicDetailResponse> getPublishedPodcastDetails(
            @PathVariable
            @Parameter(description = "Unique podcast identifier", required = true)
            @NotBlank String podcastId
    ) {
        return ResponseEntity.ok(podcastService.getPublishedPodcastDetailsById(podcastId));
    }

    // ==================== EPISODE DISCOVERY ====================

    /**
     * Lists all published episodes for a podcast.
     *
     * @param podcastId Podcast ID to retrieve episodes from
     * @return List of published episodes ordered by episode number
     */
    @Operation(
            summary = "List published episodes",
            description = "Retrieve all published episodes for a specific podcast. " +
                    "Episodes are ordered by episode number (oldest to newest). " +
                    "Only returns PUBLISHED episodes - drafts and archived episodes are excluded. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved published episodes",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodePublicDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast ID format"),
                    @ApiResponse(responseCode = "404", description = "Podcast not found or not published"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}/episodes")
    public ResponseEntity<List<EpisodePublicDetailResponse>> listPublishedEpisodes(
            @PathVariable
            @Parameter(description = "Podcast ID to retrieve episodes from", required = true)
            @NotBlank String podcastId
    ) {
        return ResponseEntity.ok(episodeService.getAllPublishedEpisodes(podcastId));
    }

    /**
     * Retrieves detailed information about a published episode.
     *
     * @param podcastId Podcast ID containing the episode
     * @param episodeId Episode ID to retrieve
     * @return Published episode details
     */
    @Operation(
            summary = "Get published episode details",
            description = "Retrieve comprehensive information about a specific published episode including " +
                    "title, description, audio URL, duration, and publication date. " +
                    "Only accessible if both podcast and episode status are PUBLISHED. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved episode details",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = EpisodePublicDetailResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid podcast or episode ID format"),
                    @ApiResponse(responseCode = "404", description = "Podcast or episode not found, or not published"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/{podcastId}/episodes/{episodeId}")
    public ResponseEntity<EpisodePublicDetailResponse> getPublishedEpisodeDetails(
            @PathVariable
            @Parameter(description = "Podcast ID containing the episode", required = true)
            @NotBlank String podcastId,
            @PathVariable
            @Parameter(description = "Episode ID to retrieve", required = true)
            @Min(1) Long episodeId
    ) {
        return ResponseEntity.ok(episodeService.getPublishedEpisodeDetails(podcastId, episodeId));
    }

    // ==================== DISCOVERY UTILITIES ====================

    /**
     * Retrieves all published podcast IDs.
     *
     * @return List of all published podcast IDs
     */
    @Operation(
            summary = "Get all published podcast IDs",
            description = "Retrieve a list of all published podcast IDs on the platform. " +
                    "Useful for indexing, sitemaps, or bulk operations. " +
                    "Only returns IDs of PUBLISHED podcasts. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved podcast IDs",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))
                    ),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/podcasts/ids")
    public ResponseEntity<List<String>> getAllPublishedPodcastIds() {
        return ResponseEntity.ok(podcastService.getAllPublishedPodcastIds());
    }

    /**
     * Retrieves all creator IDs who have published podcasts.
     *
     * @return List of unique creator user IDs with published podcasts
     */
    @Operation(
            summary = "Get all creator IDs with published podcasts",
            description = "Retrieve a list of all unique creator user IDs who have at least one published podcast. " +
                    "Useful for discovering active content creators on the platform. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved creator IDs",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))
                    ),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/creators/ids")
    public ResponseEntity<List<String>> getAllCreatorIdsWithPublishedPodcasts() {
        return ResponseEntity.ok(podcastService.getAllCreatorIdsWithPublishedPodcasts());
    }

    // ==================== CREATOR PUBLIC PROFILES ====================

    /**
     * Retrieves public profile information for a podcast creator.
     *
     * @param userId Creator user ID
     * @return Public creator profile (excludes sensitive data like email)
     */
    @Operation(
            summary = "Get creator public profile",
            description = "Retrieve public profile information for a podcast creator. " +
                    "Excludes sensitive information such as email address and account status. " +
                    "Includes display name, bio, profile image, and social links. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved creator profile",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = CreatorPublicResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid user ID format"),
                    @ApiResponse(responseCode = "404", description = "Creator not found or account inactive"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/creators/{userId}")
    public ResponseEntity<CreatorPublicResponse> getCreatorPublicProfile(
            @PathVariable
            @Parameter(description = "Creator user identifier", required = true)
            @NotBlank String userId
    ) {
        return ResponseEntity.ok(appUserService.getCreatorPublicProfile(userId));
    }

    /**
     * Lists all published podcasts created by a specific user.
     *
     * @param userId Creator user ID
     * @param page Page number (zero-indexed)
     * @param size Number of items per page
     * @return Paginated list of creator's published podcasts
     */
    @Operation(
            summary = "List creator's published podcasts",
            description = "Retrieve all published podcasts created by a specific user. " +
                    "Only returns PUBLISHED podcasts. " +
                    "Results are sorted by latest publication date. " +
                    "No authentication required.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved creator's podcasts",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid user ID format or pagination parameters"),
                    @ApiResponse(responseCode = "404", description = "Creator not found or account inactive"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/creators/{userId}/podcasts")
    public ResponseEntity<Page<PodcastPublicResponse>> getCreatorPublishedPodcasts(
            @PathVariable
            @Parameter(description = "Creator user identifier", required = true)
            @NotBlank String userId,
            @RequestParam(defaultValue = "0")
            @Parameter(description = "Page number (zero-indexed, default: 0)")
            @Min(0) int page,
            @RequestParam(defaultValue = "25")
            @Parameter(description = "Number of items per page (default: 25, max: 100)")
            @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(podcastService.getPublishedPodcastsByCreator(userId, page, size));
    }
}
