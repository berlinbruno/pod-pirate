package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminPodcastDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminPodcastResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminUserDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.admin.AdminUserResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodeDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.exception.ConflictException;
import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Episode;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.repository.AppUserRepository;
import dev.berlinbruno.PodPirateBackendApplication.repository.PodcastRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.AdminService;
import dev.berlinbruno.PodPirateBackendApplication.service.DeletionService;
import dev.berlinbruno.PodPirateBackendApplication.service.LookupService;
import dev.berlinbruno.PodPirateBackendApplication.types.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AppUserRepository appUserRepository;
    private final PodcastRepository podcastRepository;
    private final DeletionService deletionService;
    private final LookupService lookupService;
    private final MediaServiceImpl mediaServiceImpl;

    // ==================== USER MANAGEMENT ====================

    @Override
    public Page<AdminUserResponse> getAllUsers(String q, AccountRoles roles, AccountStatus status, int page, int size) {
        Boolean isLocked = determineLockedStatus(status);
        Boolean isEmailVerified = determineEmailVerifiedStatus(status);

        Page<AppUser> appUsers = lookupService.searchUsers(roles, isLocked, isEmailVerified, q, null, null, page, size);
        return appUsers.map(this::mapToAdminUserResponse);
    }

    @Override
    public AdminUserDetailResponse getUserDetailById(String userId) {
        AppUser appUser = lookupService.getById(userId);
        List<Podcast> userPodcasts = podcastRepository.findAllByUserId(userId);
        return mapToAdminUserDetailResponse(appUser, userPodcasts);
    }

    @Override
    public void lockUser(String userId) {
        AppUser appUser = lookupService.getById(userId);
        validateUserNotLocked(appUser, true);
        appUser.lock();
        appUserRepository.save(appUser);
    }

    @Override
    public void unlockUser(String userId) {
        AppUser appUser = lookupService.getById(userId);
        validateUserNotLocked(appUser, false);
        appUser.unlock();
        appUserRepository.save(appUser);
    }

    @Override
    @Transactional
    public void deleteUserAccount(String userId) {
        AppUser appUser = lookupService.getById(userId);
        deletionService.deleteUser(appUser);
    }

    // ==================== PODCAST MODERATION ====================

    @Override
    public Page<AdminPodcastResponse> getAllPodcasts(String query, PodcastStatus status, int page, int size) {
        boolean isFlagged = (status == PodcastStatus.FLAGGED);
        PodcastStatus podcastStatus = isFlagged ? null : status;

        Page<Podcast> podcasts = lookupService.searchPodcasts(
                null, null, isFlagged, podcastStatus, null, query, null, null, page, size);
        return podcasts.map(this::mapToAdminPodcastResponse);
    }

    @Override
    public AdminPodcastDetailResponse getPodcastDetails(String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        return mapToAdminPodcastDetailResponse(podcast);
    }

    @Override
    public void flagPodcast(String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        validatePodcastNotFlagged(podcast, true);

        podcast.setFlagged(true);
        podcast.setPodcastStatus(podcast.getPodcastStatus() == PodcastStatus.PUBLISHED
                ? PodcastStatus.ARCHIVED
                : podcast.getPodcastStatus());
        podcast.setPublishedAt(null);

        archivePublishedEpisodes(podcast);
        podcastRepository.save(podcast);
    }

    @Override
    public void unflagPodcast(String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        validatePodcastNotFlagged(podcast, false);

        podcast.setFlagged(false);
        podcastRepository.save(podcast);
    }

    @Override
    @Transactional
    public void deletePodcast(String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        deletionService.deletePodcast(podcast);
    }

    // ==================== EPISODE MODERATION ====================

    @Override
    public List<EpisodeDetailResponse> getPodcastEpisodes(String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);

        if (podcast.getEpisodes() == null || podcast.getEpisodes().isEmpty()) {
            return Collections.emptyList();
        }

        return mapEpisodesToDetailResponse(podcast.getEpisodes());
    }

    @Override
    @Transactional
    public void deleteEpisode(String podcastId, Long episodeId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        int episodeIndex = validateEpisodeIndex(podcast, episodeId.intValue());
        deletionService.deleteEpisode(podcast, episodeIndex);
    }

    // ==================== VALIDATION HELPERS ====================

    private Boolean determineLockedStatus(AccountStatus status) {
        if (status == null) return null;
        return switch (status) {
            case ACTIVE -> false;
            case LOCKED -> true;
            default -> null;
        };
    }

    private Boolean determineEmailVerifiedStatus(AccountStatus status) {
        if (status == null) return null;
        return switch (status) {
            case ACTIVE -> true;
            case PENDING_VERIFICATION -> false;
            default -> null;
        };
    }

    private void validateUserNotLocked(AppUser appUser, boolean shouldBeLocked) {
        if (shouldBeLocked && appUser.isLocked()) {
            throw buildConflictException(AppMessage.USER_ALREADY_LOCKED);
        }
        if (!shouldBeLocked && !appUser.isLocked()) {
            throw buildConflictException(AppMessage.USER_NOT_LOCKED);
        }
    }

    private void validatePodcastNotFlagged(Podcast podcast, boolean shouldBeFlagged) {
        if (shouldBeFlagged && podcast.isFlagged()) {
            throw buildConflictException(AppMessage.PODCAST_ALREADY_FLAGGED);
        }
        if (!shouldBeFlagged && !podcast.isFlagged()) {
            throw buildConflictException(AppMessage.PODCAST_NOT_FLAGGED);
        }
    }

    private int validateEpisodeIndex(Podcast podcast, int episodeIndex) {
        if (podcast.getEpisodes() == null ||
            episodeIndex < 0 ||
            episodeIndex >= podcast.getEpisodes().size()) {
            throw new dev.berlinbruno.PodPirateBackendApplication.exception.NotFoundException(
                    buildGeneralResponse(HttpStatus.NOT_FOUND, AppMessage.EPISODE_NOT_FOUND));
        }
        return episodeIndex;
    }

    private ConflictException buildConflictException(AppMessage message) {
        return new ConflictException(buildGeneralResponse(HttpStatus.CONFLICT, message));
    }

    private GeneralResponse buildGeneralResponse(HttpStatus status, AppMessage message) {
        return new GeneralResponse(status, message.getCode(), message.getMessage(), message.getDetail());
    }

    // ==================== BUSINESS LOGIC HELPERS ====================

    private void archivePublishedEpisodes(Podcast podcast) {
        if (podcast.getEpisodes() != null) {
            podcast.getEpisodes().stream()
                    .filter(episode -> episode.getEpisodeStatus() == EpisodeStatus.PUBLISHED)
                    .forEach(episode -> {
                        episode.setEpisodeStatus(EpisodeStatus.ARCHIVED);
                        episode.setPublishedAt(null);
                    });
        }
    }

    private int calculateEpisodeCount(List<Episode> episodes) {
        return episodes != null ? episodes.size() : 0;
    }

    private Date findLastPublishedEpisodeDate(List<Episode> episodes) {
        return episodes.stream()
                .filter(e -> e.getEpisodeStatus() == EpisodeStatus.PUBLISHED)
                .map(Episode::getPublishedAt)
                .max(Date::compareTo)
                .orElse(null);
    }

    private List<Episode> getEpisodesOrEmpty(Podcast podcast) {
        return Optional.ofNullable(podcast.getEpisodes()).orElse(Collections.emptyList());
    }

    // ==================== MAPPER METHODS - USER ====================

    private AdminUserResponse mapToAdminUserResponse(AppUser appUser) {
        int podcastCount = (int) podcastRepository.countByUserId(appUser.getId());

        return AdminUserResponse.builder()
                .userId(appUser.getId())
                .username(appUser.getGenericUsername())
                .email(appUser.getEmail())
                .profileUrl(mediaServiceImpl.getDownloadUrl(appUser.getProfileUrl()))
                .isLocked(appUser.isLocked())
                .isEmailVerified(appUser.isEmailVerified())
                .roles(appUser.getRoles())
                .podcastCount(podcastCount)
                .createdDate(appUser.getCreatedAt())
                .lastLoginDate(appUser.getLastLoginAt())
                .build();
    }

    private AdminUserDetailResponse mapToAdminUserDetailResponse(AppUser appUser, List<Podcast> userPodcasts) {
        int totalEpisodeCount = userPodcasts.stream()
                .mapToInt(podcast -> calculateEpisodeCount(podcast.getEpisodes()))
                .sum();

        List<AdminUserDetailResponse.PodcastSummary> recentPodcasts = mapRecentPodcasts(userPodcasts);
        int podcastCount = (int) podcastRepository.countByUserId(appUser.getId());

        return AdminUserDetailResponse.builder()
                .userId(appUser.getId())
                .username(appUser.getUsername())
                .email(appUser.getEmail())
                .bio(appUser.getBio())
                .profileUrl(mediaServiceImpl.getDownloadUrl(appUser.getProfileUrl()))
                .isLocked(appUser.isLocked())
                .isEmailVerified(appUser.isEmailVerified())
                .roles(appUser.getRoles())
                .podcastCount(podcastCount)
                .totalEpisodeCount(totalEpisodeCount)
                .createdDate(appUser.getCreatedAt())
                .updatedDate(appUser.getLastModifiedAt())
                .lastLoginDate(appUser.getLastLoginAt())
                .recentPodcasts(recentPodcasts)
                .build();
    }

    private List<AdminUserDetailResponse.PodcastSummary> mapRecentPodcasts(List<Podcast> podcasts) {
        return podcasts.stream()
                .limit(5)
                .map(podcast -> AdminUserDetailResponse.PodcastSummary.builder()
                        .podcastId(podcast.getId())
                        .title(podcast.getTitle())
                        .episodeCount(calculateEpisodeCount(podcast.getEpisodes()))
                        .createdDate(podcast.getCreatedAt())
                        .build())
                .toList();
    }

    // ==================== MAPPER METHODS - PODCAST ====================

    private AdminPodcastResponse mapToAdminPodcastResponse(Podcast podcast) {
        AppUser creator = lookupService.getById(podcast.getUserId());
        List<Episode> episodes = getEpisodesOrEmpty(podcast);

        return AdminPodcastResponse.builder()
                .podcastId(podcast.getId())
                .title(podcast.getTitle())
                .category(podcast.getCategory())
                .coverUrl(mediaServiceImpl.getDownloadUrl(podcast.getCoverUrl()))
                .podcastStatus(podcast.getPodcastStatus())
                .isFlagged(podcast.isFlagged())
                .creatorId(podcast.getUserId())
                .creatorName(creator.getGenericUsername())
                .episodeCount(episodes.size())
                .createdDate(podcast.getCreatedAt())
                .publishedDate(podcast.getPublishedAt())
                .lastEpisodeDate(findLastPublishedEpisodeDate(episodes))
                .build();
    }

    private AdminPodcastDetailResponse mapToAdminPodcastDetailResponse(Podcast podcast) {
        AppUser creator = lookupService.getById(podcast.getUserId());
        List<Episode> episodes = getEpisodesOrEmpty(podcast);

        return AdminPodcastDetailResponse.builder()
                .podcastId(podcast.getId())
                .title(podcast.getTitle())
                .description(podcast.getDescription())
                .category(podcast.getCategory())
                .coverUrl(mediaServiceImpl.getDownloadUrl(podcast.getCoverUrl()))
                .bannerUrl(mediaServiceImpl.getDownloadUrl(podcast.getBannerUrl()))
                .isFlagged(podcast.isFlagged())
                .creatorId(podcast.getUserId())
                .creatorName(creator.getGenericUsername())
                .creatorEmail(creator.getEmail())
                .podcastStatus(podcast.getPodcastStatus())
                .episodeCount(episodes.size())
                .createdDate(podcast.getCreatedAt())
                .updatedDate(podcast.getLastModifiedAt())
                .publishedDate(podcast.getPublishedAt())
                .lastEpisodeDate(findLastPublishedEpisodeDate(episodes))
                .build();
    }

    // ==================== MAPPER METHODS - EPISODE ====================

    private List<EpisodeDetailResponse> mapEpisodesToDetailResponse(List<Episode> episodes) {
        return IntStream.range(0, episodes.size())
                .mapToObj(i -> mapEpisodeToDetailResponse(episodes.get(i), i))
                .toList();
    }

    private EpisodeDetailResponse mapEpisodeToDetailResponse(Episode episode, int index) {
        return EpisodeDetailResponse.builder()
                .episodeId(index)
                .title(episode.getTitle())
                .description(episode.getDescription())
                .coverUrl(mediaServiceImpl.getDownloadUrl(episode.getImageUrl()))
                .audioUrl(mediaServiceImpl.getDownloadUrl(episode.getAudioUrl()))
                .durationSeconds(episode.getDurationSeconds())
                .episodeStatus(episode.getEpisodeStatus())
                .createdDate(episode.getCreatedAt())
                .updatedDate(episode.getUpdatedAt())
                .publishedDate(episode.getPublishedAt())
                .build();
    }

}
