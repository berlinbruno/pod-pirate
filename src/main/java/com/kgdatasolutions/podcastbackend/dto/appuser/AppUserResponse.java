package com.kgdatasolutions.podcastbackend.dto.appuser;

import lombok.Data;

@Data
public class AppUserResponse {
    String name;
    String profileUrl;
    String bannerUrl;
    String category;
    String title;
    String description;
}
