package dev.berlinbruno.PodPirateBackendApplication.dto.podcast;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PodcastPublicResponse {
    private String podcastId;
    private String title;
    private String description;
    private String category;
    private String coverUrl;
    private String bannerUrl;
    private String creatorId;
    private String creatorName;
    private long episodeCount;
    private Date publishedDate;
    private Date lastEpisodeDate;
}

