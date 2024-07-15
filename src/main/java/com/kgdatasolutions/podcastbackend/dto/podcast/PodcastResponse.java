package com.kgdatasolutions.podcastbackend.dto.podcast;

import lombok.Data;

import java.util.List;

@Data
public class PodcastResponse {
    private String authorName;
    private String authorProfileUrl;
    private String authorBannerUrl;
    private String podcastId;
    private String podcastTitle;
    private String podcastDescription;
    private String category;
    private List<Integer> episodesWithIndexes;
}
