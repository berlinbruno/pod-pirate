package dev.berlinbruno.PodPirateBackendApplication.dto.episode;

import dev.berlinbruno.PodPirateBackendApplication.types.EpisodeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeDetailResponse {
    private long episodeId;
    private String title;
    private String description;
    private EpisodeStatus episodeStatus;
    private String coverUrl;
    private String audioUrl;
    private long durationSeconds;
    private Date createdDate;
    private Date publishedDate;
    private Date updatedDate;
}

