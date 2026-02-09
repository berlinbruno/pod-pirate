package dev.berlinbruno.PodPirateBackendApplication.dto.admin;

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
public class AdminPodcastDetailResponse {
    private String podcastId;
    private String title;
    private String description;
    private String category;
    private String coverUrl;
    private String bannerUrl;
    private PodcastStatus podcastStatus;
    private boolean isFlagged;
    private String creatorId;
    private String creatorName;
    private String creatorEmail;
    private long episodeCount;
    private Date createdDate;
    private Date publishedDate;
    private Date updatedDate;
    private Date lastEpisodeDate;
}

