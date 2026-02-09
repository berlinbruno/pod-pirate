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
public class PodcastDetailResponse {
    private String podcastId;
    private String title;
    private String description;
    private String category;
    private String bannerUrl;
    private String coverUrl;
    private PodcastStatus podcastStatus;
    private long episodeCount;
    private Date createdDate;
    private Date updatedDate;
    private Date publishedDate;
    private Date lastEpisodeDate;
    private boolean isFlagged;
}

