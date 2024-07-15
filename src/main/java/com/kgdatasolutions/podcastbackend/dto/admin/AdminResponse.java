package com.kgdatasolutions.podcastbackend.dto.admin;

import lombok.Data;

@Data
public class AdminResponse {
    private String authorName;
    private String authorProfileUrl;
    private String podcastId;
    private String podcastTitle;
    private Boolean locked;
    private String category;
    private int noOfEpisodes;
}
