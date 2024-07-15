package com.kgdatasolutions.podcastbackend.mapper;

import com.kgdatasolutions.podcastbackend.Model.AppUser;
import com.kgdatasolutions.podcastbackend.dto.podcast.PodcastResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PodcastMapper {


    public PodcastResponse mapToPodcastResponse(AppUser appUser) {
        PodcastResponse response = new PodcastResponse();
        response.setAuthorName(appUser.getName());
        response.setPodcastId(appUser.getId());
        response.setCategory(appUser.getCategory());
        response.setPodcastTitle(appUser.getTitle());
        response.setPodcastDescription(appUser.getDescription());

        // Generate signed URL for profile image if not null
        if (appUser.getProfileUrl() != null) {
            //                String signedProfileImageUrl = azureBlobService.generateSignedUrlForDownload(appUser.getProfileUrl());
            response.setAuthorProfileUrl(appUser.getProfileUrl());
        }

        // Generate signed URL for banner image if not null
        if (appUser.getBannerUrl() != null) {
            //                String signedBannerImageUrl = azureBlobService.generateSignedUrlForDownload(appUser.getBannerUrl());
            response.setAuthorBannerUrl(appUser.getBannerUrl());
        }

        // Check if episodes list is not null before including it in the response
        if (appUser.getEpisodes() != null) {
            List<Integer> episodesWithIndexes = new ArrayList<>();
            for (int i = 0; i < appUser.getEpisodes().size(); i++) {
                episodesWithIndexes.add(i);
            }
            response.setEpisodesWithIndexes(episodesWithIndexes);
        }

        return response;
    }
}
