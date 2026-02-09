package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.podcast.*;
import dev.berlinbruno.PodPirateBackendApplication.exception.ForbiddenException;
import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Episode;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.repository.PodcastRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.*;
import dev.berlinbruno.PodPirateBackendApplication.types.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

@Slf4j
@Service
@RequiredArgsConstructor
public class PodcastServiceImpl implements PodcastService {

    private final PodcastRepository podcastRepository;
    private final CloudBlobService cloudBlobService;
    private final LookupService lookupService;
    private final MediaService mediaService;
    private final AuthValidationService authValidationService;
    private final DeletionService deletionService;

    // ==================== USER PODCAST MANAGEMENT ====================

    @Override
    public Page<PodcastResponse> getAllPodcastsForUser(String userId, String q, PodcastStatus status, int page, int size) {
        boolean isFlagged = (status == PodcastStatus.FLAGGED);
        PodcastStatus podcastStatus = isFlagged ? null : status;

        Page<Podcast> podcasts = lookupService.searchPodcasts(
                userId, null, isFlagged, podcastStatus, null, q, null, null, page, size);
        return podcasts.map(this::mapToPodcastResponse);
    }

    @Override
    @Transactional
    public PodcastDetailResponse createUserPodcast(String userId, CreatePodcastRequest createRequest) {
        AppUser appUser = lookupService.getById(userId);

        Podcast podcast = buildNewPodcast(appUser.getId(), createRequest);
        Podcast saved = podcastRepository.save(podcast);

        return mapToPodcastDetailResponse(saved);
    }

    @Override
    public PodcastDetailResponse getUserPodcastDetails(String userId, String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);
        return mapToPodcastDetailResponse(podcast);
    }

    @Override
    public ImageUploadResponse generatePodcastImageUploadUrl(String userId, String podcastId,
                                                              ImageType imageType, ImageExtension extension) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        String blobPath = buildPodcastImageBlobPath(podcastId, imageType, extension);
        String uploadUrl = cloudBlobService.generateSignedUrlForUpload(blobPath);

        return ImageUploadResponse.builder()
                .uploadUrl(uploadUrl)
                .blobPath(blobPath)
                .build();
    }

    @Override
    @Transactional
    public PodcastDetailResponse updateUserPodcast(String userId, String podcastId, UpdatePodcastRequest updateRequest) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        applyPodcastUpdates(podcast, updateRequest);
        Podcast updated = podcastRepository.save(podcast);

        return mapToPodcastDetailResponse(updated);
    }

    @Override
    @Transactional
    public PodcastDetailResponse publishUserPodcast(String userId, String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        validatePodcastCanBePublished(podcast);

        podcast.setPodcastStatus(PodcastStatus.PUBLISHED);
        podcast.setPublishedAt(getCurrentUtcDate());

        Podcast updated = podcastRepository.save(podcast);
        return mapToPodcastDetailResponse(updated);
    }

    @Override
    @Transactional
    public PodcastDetailResponse archiveUserPodcast(String userId, String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        podcast.setPodcastStatus(PodcastStatus.ARCHIVED);
        podcast.setPublishedAt(null);

        Podcast updated = podcastRepository.save(podcast);
        return mapToPodcastDetailResponse(updated);
    }

    @Override
    @Transactional
    public void deleteUserPodcast(String userId, String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);
        deletionService.deletePodcast(podcast);
    }

    // ==================== PUBLIC PODCAST DISCOVERY ====================

    @Override
    public Page<PodcastPublicResponse> getAllPublishedPodcasts(String query, String category, int page, int size) {
        Page<Podcast> podcasts = lookupService.searchPodcasts(
                null, category, null, PodcastStatus.PUBLISHED, EpisodeStatus.PUBLISHED,
                query, null, null, page, size);
        return podcasts.map(this::mapToPodcastPublicResponse);
    }

    @Override
    public PodcastPublicDetailResponse getPublishedPodcastDetailsById(String podcastId) {
        Podcast podcast = lookupService.getPublishedPodcastById(podcastId);
        return mapToPodcastPublicDetailResponse(podcast);
    }

    @Override
    public Page<PodcastPublicResponse> getPublishedPodcastsByCreator(String userId, int page, int size) {
        Page<Podcast> podcasts = lookupService.searchPodcasts(
                userId, null, null, PodcastStatus.PUBLISHED, EpisodeStatus.PUBLISHED,
                null, null, null, page, size);
        return podcasts.map(this::mapToPodcastPublicResponse);
    }

    // ==================== VALIDATION HELPERS ====================

    private void validatePodcastCanBePublished(Podcast podcast) {
        if (podcast.isFlagged()) {
            throw buildForbiddenException(AppMessage.PODCAST_FORBIDDEN_TO_PUBLISH);
        }

        if (podcast.getCoverUrl() != null) {
            mediaService.validateFileExists(podcast.getCoverUrl());
        } else {
            throw buildForbiddenException(AppMessage.PODCAST_MISSING_ASSETS);
        }

        if (!hasPublishedEpisodes(podcast)) {
            throw buildForbiddenException(AppMessage.PODCAST_MISSING_EPISODE);
        }
    }

    private boolean hasPublishedEpisodes(Podcast podcast) {
        return podcast.getEpisodes() != null &&
               !podcast.getEpisodes().isEmpty() &&
               podcast.getEpisodes().stream()
                       .anyMatch(episode -> episode.getEpisodeStatus() == EpisodeStatus.PUBLISHED);
    }

    private ForbiddenException buildForbiddenException(AppMessage message) {
        return new ForbiddenException(buildGeneralResponse(HttpStatus.FORBIDDEN, message));
    }

    private GeneralResponse buildGeneralResponse(HttpStatus status, AppMessage message) {
        return new GeneralResponse(status, message.getCode(), message.getMessage(), message.getDetail());
    }

    // ==================== BUSINESS LOGIC HELPERS ====================

    private Podcast buildNewPodcast(String userId, CreatePodcastRequest request) {
        return Podcast.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory().toLowerCase())
                .podcastStatus(PodcastStatus.DRAFT)
                .build();
    }

    private void applyPodcastUpdates(Podcast podcast, UpdatePodcastRequest updateRequest) {
        if (updateRequest.getTitle() != null) {
            podcast.setTitle(updateRequest.getTitle());
        }
        if (updateRequest.getDescription() != null) {
            podcast.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getCategory() != null) {
            podcast.setCategory(updateRequest.getCategory().toLowerCase());
        }

        updateMediaUrlIfPresent(updateRequest.getCoverUrl(), podcast.getCoverUrl(), podcast::setCoverUrl);
        updateMediaUrlIfPresent(updateRequest.getBannerUrl(), podcast.getBannerUrl(), podcast::setBannerUrl);
    }

    private void updateMediaUrlIfPresent(String newUrl, String currentUrl, Consumer<String> setter) {
        if (newUrl != null) {
            mediaService.replaceFileIfChanged(newUrl, currentUrl);
            setter.accept(newUrl);
        }
    }

    private String buildPodcastImageBlobPath(String podcastId, ImageType imageType, ImageExtension extension) {
        String imageFolder = (imageType == ImageType.PODCAST_COVER) ? "cover" : "banner";
        return String.format("media/podcasts/%s/%s/%s.%s",
                podcastId, imageFolder, UUID.randomUUID(), extension.name());
    }

    private Date getCurrentUtcDate() {
        return Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant());
    }

    private List<Episode> getEpisodesOrEmpty(Podcast podcast) {
        return Optional.ofNullable(podcast.getEpisodes()).orElse(Collections.emptyList());
    }

    private long countPublishedEpisodes(List<Episode> episodes) {
        return episodes.stream()
                .filter(e -> e.getEpisodeStatus() == EpisodeStatus.PUBLISHED)
                .count();
    }

    private Date findLastPublishedEpisodeDate(List<Episode> episodes) {
        return episodes.stream()
                .filter(e -> e.getEpisodeStatus() == EpisodeStatus.PUBLISHED)
                .map(Episode::getPublishedAt)
                .max(Date::compareTo)
                .orElse(null);
    }

    // ==================== MAPPER METHODS - USER ====================

    private PodcastResponse mapToPodcastResponse(Podcast podcast) {
        List<Episode> episodes = getEpisodesOrEmpty(podcast);

        return PodcastResponse.builder()
                .podcastId(podcast.getId())
                .title(podcast.getTitle())
                .category(podcast.getCategory())
                .coverUrl(mediaService.getDownloadUrl(podcast.getCoverUrl()))
                .podcastStatus(podcast.getPodcastStatus())
                .isFlagged(podcast.isFlagged())
                .episodeCount(episodes.size())
                .publishedDate(podcast.getPublishedAt())
                .lastEpisodeDate(findLastPublishedEpisodeDate(episodes))
                .build();
    }

    private PodcastDetailResponse mapToPodcastDetailResponse(Podcast podcast) {
        List<Episode> episodes = getEpisodesOrEmpty(podcast);

        return PodcastDetailResponse.builder()
                .podcastId(podcast.getId())
                .title(podcast.getTitle())
                .description(podcast.getDescription())
                .category(podcast.getCategory())
                .podcastStatus(podcast.getPodcastStatus())
                .coverUrl(mediaService.getDownloadUrl(podcast.getCoverUrl()))
                .bannerUrl(mediaService.getDownloadUrl(podcast.getBannerUrl()))
                .episodeCount(episodes.size())
                .createdDate(podcast.getCreatedAt())
                .updatedDate(podcast.getLastModifiedAt())
                .publishedDate(podcast.getPublishedAt())
                .lastEpisodeDate(findLastPublishedEpisodeDate(episodes))
                .isFlagged(podcast.isFlagged())
                .build();
    }

    // ==================== MAPPER METHODS - PUBLIC ====================

    private PodcastPublicResponse mapToPodcastPublicResponse(Podcast podcast) {
        AppUser creator = lookupService.getById(podcast.getUserId());
        List<Episode> episodes = getEpisodesOrEmpty(podcast);

        return PodcastPublicResponse.builder()
                .podcastId(podcast.getId())
                .title(podcast.getTitle())
                .description(podcast.getDescription())
                .creatorId(creator.getId())
                .creatorName(creator.getGenericUsername())
                .category(podcast.getCategory())
                .coverUrl(mediaService.getDownloadUrl(podcast.getCoverUrl()))
                .bannerUrl(mediaService.getDownloadUrl(podcast.getBannerUrl()))
                .episodeCount(countPublishedEpisodes(episodes))
                .publishedDate(podcast.getPublishedAt())
                .lastEpisodeDate(findLastPublishedEpisodeDate(episodes))
                .build();
    }

    private PodcastPublicDetailResponse mapToPodcastPublicDetailResponse(Podcast podcast) {
        AppUser creator = lookupService.getById(podcast.getUserId());
        List<Episode> episodes = getEpisodesOrEmpty(podcast);

        return PodcastPublicDetailResponse.builder()
                .podcastId(podcast.getId())
                .title(podcast.getTitle())
                .description(podcast.getDescription())
                .creatorName(creator.getGenericUsername())
                .creatorBio(creator.getBio())
                .creatorId(creator.getId())
                .category(podcast.getCategory())
                .coverUrl(mediaService.getDownloadUrl(podcast.getCoverUrl()))
                .bannerUrl(mediaService.getDownloadUrl(podcast.getBannerUrl()))
                .episodeCount(countPublishedEpisodes(episodes))
                .publishedDate(podcast.getPublishedAt())
                .lastEpisodeDate(findLastPublishedEpisodeDate(episodes))
                .build();
    }
}

