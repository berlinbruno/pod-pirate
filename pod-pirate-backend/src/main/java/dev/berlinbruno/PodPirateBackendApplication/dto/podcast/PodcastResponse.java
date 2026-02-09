package dev.berlinbruno.PodPirateBackendApplication.dto.podcast;

import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PodcastResponse {
    private String podcastId;
    private String title;
    private String category;
    private String coverUrl;
    private PodcastStatus podcastStatus;
    private boolean isFlagged;
    private long episodeCount;
    private Date publishedDate;
    private Date lastEpisodeDate;
}

