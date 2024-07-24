package dev.berlinbruno.PodPirateBackendApplication.mapper;

import dev.berlinbruno.PodPirateBackendApplication.model.Episode;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodeResponse;
import org.springframework.stereotype.Component;

@Component
public class EpisodeMapper {
    public EpisodeResponse mapToEpisodeResponse(Episode episode, int episodeIndex) {
        EpisodeResponse response = new EpisodeResponse();
        // Set episode index as the identifier
        response.setEpisodeId(episodeIndex);
        response.setTitle(episode.getTitle());
        response.setDescription(episode.getDescription());
        response.setAudioUrl(episode.getAudioUrl());
        response.setPodcastId(episode.getUserId());
        response.setDuration(episode.getDuration());
        return response;
    }
}

