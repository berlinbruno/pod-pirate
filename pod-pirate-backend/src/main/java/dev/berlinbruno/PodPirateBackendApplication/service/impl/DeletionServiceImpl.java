package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Episode;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.repository.AppUserRepository;
import dev.berlinbruno.PodPirateBackendApplication.repository.PodcastRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.DeletionService;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DeletionServiceImpl implements DeletionService {
    private final PodcastRepository podcastRepository;
    private final MediaServiceImpl mediaServiceImpl;
    private final AppUserRepository appUserRepository;

    public void deleteUser(AppUser user) {

        List<Podcast> podcasts = podcastRepository.findAllByUserId(user.getId());
        podcasts.forEach(this::deletePodcast);

        mediaServiceImpl.deleteIfExists(user.getProfileUrl());

        appUserRepository.deleteById(user.getId());
    }

    public void deletePodcast(Podcast podcast) {

        List<Episode> episodes = podcast.getEpisodes();
        if (episodes != null) {
            for (int i = episodes.size() - 1; i >= 0; i--) {
                deleteEpisode(podcast, i);
            }
        }

        mediaServiceImpl.deleteIfExists(podcast.getCoverUrl());
        mediaServiceImpl.deleteIfExists(podcast.getBannerUrl());

        podcastRepository.deleteById(podcast.getId());
    }

    public void deleteEpisode(Podcast podcast, int episodeIndex) {

        Episode episode = podcast.getEpisodes().get(episodeIndex);

        mediaServiceImpl.deleteIfExists(episode.getAudioUrl());
        mediaServiceImpl.deleteIfExists(episode.getImageUrl());

        podcast.getEpisodes().remove(episodeIndex);

        if (podcast.getEpisodes().isEmpty())
            podcast.setPodcastStatus(podcast.getPodcastStatus() == PodcastStatus.ARCHIVED ? PodcastStatus.ARCHIVED : PodcastStatus.DRAFT);

        podcastRepository.save(podcast);
    }
}
