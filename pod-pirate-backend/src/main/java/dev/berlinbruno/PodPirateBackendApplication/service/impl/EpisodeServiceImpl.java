package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.CreateEpisodeRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodeDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodePublicDetailResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.UpdateEpisodeRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.AudioUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.exception.ForbiddenException;
import dev.berlinbruno.PodPirateBackendApplication.exception.NotFoundException;
import dev.berlinbruno.PodPirateBackendApplication.model.Episode;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.repository.PodcastRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.*;
import dev.berlinbruno.PodPirateBackendApplication.types.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class EpisodeServiceImpl implements EpisodeService {

    private final CloudBlobService cloudBlobService;
    private final PodcastRepository podcastRepository;
    private final LookupService lookupService;
    private final MediaServiceImpl mediaServiceImpl;
    private final AuthValidationService authValidationService;
    private final DeletionService deletionService;

    // ==================== PUBLIC EPISODE DISCOVERY ====================

    @Override
    public List<EpisodePublicDetailResponse> getAllPublishedEpisodes(String podcastId) {
        Podcast podcast = lookupService.getPublishedPodcastById(podcastId);
        List<Episode> publishedEpisodes = filterPublishedEpisodes(podcast.getEpisodes());
        validateEpisodesExist(publishedEpisodes);

        return mapEpisodesToPublicResponse(publishedEpisodes);
    }

    @Override
    public EpisodePublicDetailResponse getPublishedEpisodeDetails(String podcastId, Long episodeId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        List<Episode> publishedEpisodes = filterPublishedEpisodes(podcast.getEpisodes());
        validateEpisodesExist(publishedEpisodes);

        int index = validateAndGetEpisodeIndex(episodeId, publishedEpisodes.size());
        Episode episode = publishedEpisodes.get(index);

        return mapEpisodeToPublicDetailResponse(episode, episodeId);
    }

    // ==================== USER EPISODE MANAGEMENT ====================

    @Override
    public List<EpisodeDetailResponse> getUserPodcastEpisodes(String userId, String podcastId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        List<Episode> episodes = podcast.getEpisodes();
        validateEpisodesExist(episodes);

        return mapEpisodesToDetailResponse(episodes);
    }

    @Override
    public EpisodeDetailResponse createUserEpisode(String userId, String podcastId, CreateEpisodeRequest createRequest) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        List<Episode> episodes = getOrInitializeEpisodes(podcast);
        Episode newEpisode = buildNewEpisode(createRequest);

        episodes.add(newEpisode);
        podcast.setEpisodes(episodes);
        podcastRepository.save(podcast);

        return mapEpisodeToDetailResponse(newEpisode, episodes.size() - 1);
    }

    @Override
    public EpisodeDetailResponse getUserEpisodeDetails(String userId, String podcastId, Long episodeId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        List<Episode> episodes = podcast.getEpisodes();
        validateEpisodesExist(episodes);

        int index = validateAndGetEpisodeIndex(episodeId, episodes.size());
        Episode episode = episodes.get(index);

        return mapEpisodeToDetailResponse(episode, index);
    }

    @Override
    public ImageUploadResponse generateEpisodeImageUploadUrl(String userId, String podcastId, Long episodeId,
                                                              ImageType imageType, ImageExtension extension) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        String blobPath = buildEpisodeImageBlobPath(podcastId, episodeId, extension);
        String uploadUrl = cloudBlobService.generateSignedUrlForUpload(blobPath);

        return ImageUploadResponse.builder()
                .uploadUrl(uploadUrl)
                .blobPath(blobPath)
                .build();
    }

    @Override
    public AudioUploadResponse generateEpisodeAudioUploadUrl(String userId, String podcastId, Long episodeId,
                                                             AudioType audioType, AudioExtension extension) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        String blobPath = buildEpisodeAudioBlobPath(podcastId, episodeId, extension);
        String uploadUrl = cloudBlobService.generateSignedUrlForUpload(blobPath);

        return AudioUploadResponse.builder()
                .uploadUrl(uploadUrl)
                .blobPath(blobPath)
                .build();
    }

    @Override
    public EpisodeDetailResponse updateUserEpisode(String userId, String podcastId, Long episodeId,
                                                   UpdateEpisodeRequest updateRequest) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        List<Episode> episodes = podcast.getEpisodes();
        validateEpisodesExist(episodes);

        int index = validateAndGetEpisodeIndex(episodeId, episodes.size());
        Episode episode = episodes.get(index);

        applyEpisodeUpdates(episode, updateRequest);
        episode.setUpdatedAt(getCurrentUtcDate());

        podcastRepository.save(podcast);
        return mapEpisodeToDetailResponse(episode, index);
    }

    @Override
    public EpisodeDetailResponse publishUserEpisode(String userId, String podcastId, Long episodeId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        List<Episode> episodes = podcast.getEpisodes();
        validateEpisodesExist(episodes);

        int index = validateAndGetEpisodeIndex(episodeId, episodes.size());
        Episode episode = episodes.get(index);

        validateEpisodeCanBePublished(episode);

        episode.setEpisodeStatus(EpisodeStatus.PUBLISHED);
        episode.setPublishedAt(getCurrentUtcDate());

        podcastRepository.save(podcast);
        return mapEpisodeToDetailResponse(episode, index);
    }

    @Override
    public EpisodeDetailResponse archiveUserEpisode(String userId, String podcastId, Long episodeId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        List<Episode> episodes = podcast.getEpisodes();
        validateEpisodesExist(episodes);

        int index = validateAndGetEpisodeIndex(episodeId, episodes.size());
        Episode episode = episodes.get(index);

        episode.setEpisodeStatus(EpisodeStatus.ARCHIVED);
        episode.setPublishedAt(null);

        podcastRepository.save(podcast);
        return mapEpisodeToDetailResponse(episode, index);
    }

    @Override
    public void deleteUserEpisode(String userId, String podcastId, Long episodeId) {
        Podcast podcast = lookupService.getPodcastById(podcastId);
        authValidationService.validateOwnership(podcast, userId);

        List<Episode> episodes = podcast.getEpisodes();
        validateEpisodesExist(episodes);

        int index = validateAndGetEpisodeIndex(episodeId, episodes.size());
        deletionService.deleteEpisode(podcast, index);
    }

    // ==================== VALIDATION HELPERS ====================

    private void validateEpisodesExist(List<Episode> episodes) {
        if (episodes == null || episodes.isEmpty()) {
            throw buildNotFoundException(AppMessage.EPISODE_NOT_FOUND);
        }
    }

    private int validateAndGetEpisodeIndex(Long episodeId, int episodesSize) {
        int index = episodeId.intValue();
        if (index < 0 || index >= episodesSize) {
            throw buildNotFoundException(AppMessage.EPISODE_NOT_FOUND);
        }
        return index;
    }

    private void validateEpisodeCanBePublished(Episode episode) {
        if (episode.getAudioUrl() == null) {
            throw buildForbiddenException(AppMessage.EPISODE_MISSING_AUDIO);
        }
        mediaServiceImpl.validateFileExists(episode.getAudioUrl());
    }

    private NotFoundException buildNotFoundException(AppMessage message) {
        return new NotFoundException(buildGeneralResponse(HttpStatus.NOT_FOUND, message));
    }

    private ForbiddenException buildForbiddenException(AppMessage message) {
        return new ForbiddenException(buildGeneralResponse(HttpStatus.FORBIDDEN, message));
    }

    private GeneralResponse buildGeneralResponse(HttpStatus status, AppMessage message) {
        return new GeneralResponse(status, message.getCode(), message.getMessage(), message.getDetail());
    }

    // ==================== BUSINESS LOGIC HELPERS ====================

    private List<Episode> filterPublishedEpisodes(List<Episode> episodes) {
        return episodes.stream()
                .filter(e -> e.getEpisodeStatus() == EpisodeStatus.PUBLISHED)
                .toList();
    }

    private List<Episode> getOrInitializeEpisodes(Podcast podcast) {
        List<Episode> episodes = podcast.getEpisodes();
        if (episodes == null) {
            episodes = new ArrayList<>();
            podcast.setEpisodes(episodes);
        }
        return episodes;
    }

    private Episode buildNewEpisode(CreateEpisodeRequest request) {
        Episode episode = new Episode();
        episode.setTitle(request.getTitle());
        episode.setDescription(request.getDescription());
        episode.setDurationSeconds(request.getDurationSeconds());
        episode.setEpisodeStatus(EpisodeStatus.DRAFT);
        episode.setCreatedAt(getCurrentUtcDate());
        episode.setUpdatedAt(getCurrentUtcDate());
        return episode;
    }

    private void applyEpisodeUpdates(Episode episode, UpdateEpisodeRequest updateRequest) {
        if (updateRequest.getTitle() != null) {
            episode.setTitle(updateRequest.getTitle());
        }
        if (updateRequest.getDescription() != null) {
            episode.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getDurationSeconds() != null) {
            episode.setDurationSeconds(updateRequest.getDurationSeconds());
        }

        updateMediaUrlIfPresent(updateRequest.getImageUrl(), episode.getImageUrl(), episode::setImageUrl);
        updateMediaUrlIfPresent(updateRequest.getAudioUrl(), episode.getAudioUrl(), episode::setAudioUrl);
    }

    private void updateMediaUrlIfPresent(String newUrl, String currentUrl, Consumer<String> setter) {
        if (newUrl != null) {
            mediaServiceImpl.replaceFileIfChanged(newUrl, currentUrl);
            setter.accept(newUrl);
        }
    }

    private String buildEpisodeImageBlobPath(String podcastId, Long episodeId, ImageExtension extension) {
        return String.format("media/podcasts/%s/episodes/%s/image/%s.%s",
                podcastId, episodeId, UUID.randomUUID(), extension.name());
    }

    private String buildEpisodeAudioBlobPath(String podcastId, Long episodeId, AudioExtension extension) {
        return String.format("media/podcasts/%s/episodes/%s/audio/%s.%s",
                podcastId, episodeId, UUID.randomUUID(), extension.name());
    }

    private Date getCurrentUtcDate() {
        return Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant());
    }

    // ==================== MAPPER METHODS - PUBLIC ====================

    private List<EpisodePublicDetailResponse> mapEpisodesToPublicResponse(List<Episode> episodes) {
        return IntStream.range(0, episodes.size())
                .mapToObj(i -> mapEpisodeToPublicDetailResponse(episodes.get(i), (long) i))
                .toList();
    }

    private EpisodePublicDetailResponse mapEpisodeToPublicDetailResponse(Episode episode, Long index) {
        return EpisodePublicDetailResponse.builder()
                .episodeId(index)
                .title(episode.getTitle())
                .description(episode.getDescription())
                .coverUrl(mediaServiceImpl.getDownloadUrl(episode.getImageUrl()))
                .audioUrl(mediaServiceImpl.getDownloadUrl(episode.getAudioUrl()))
                .durationSeconds(episode.getDurationSeconds())
                .publishedDate(episode.getPublishedAt())
                .build();
    }

    // ==================== MAPPER METHODS - USER ====================

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

