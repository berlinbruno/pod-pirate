package dev.berlinbruno.PodPirateBackendApplication.controller;

import dev.berlinbruno.PodPirateBackendApplication.service.AppUserService;
import dev.berlinbruno.PodPirateBackendApplication.service.EpisodeService;
import dev.berlinbruno.PodPirateBackendApplication.service.PodcastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicController {

    private final AppUserService appUserService;
    private final EpisodeService episodeService;
    private final PodcastService podcastService;

    @GetMapping("/get/podcasts/all")
    public ResponseEntity<?> getAllPodcasts() {
        return podcastService.getAllPodcasts();
    }

    @GetMapping("/get/podcasts/query/{userQuery}")
    public ResponseEntity<?> getPodcastsByQuery(@PathVariable String userQuery) {
        String query = userQuery.toLowerCase();
        return podcastService.getPodcastsByUserQuery(query);
    }

    @GetMapping("/get/podcasts/category/{category}")
    public ResponseEntity<?> getPodcastsByCategory(@PathVariable String category) {
        return podcastService.getPodcastsByCategory(category);
    }

    @GetMapping("/get/podcasts/latest")
    public ResponseEntity<?> getPodcastsByLatest(@PathVariable String category) {
        return podcastService.getPodcastsSortedByDate();
    }

    @GetMapping("/get/podcast/{userId}")
    public ResponseEntity<?> getPodcastsById(@PathVariable String userId) {
        return podcastService.getPodcastsByUserId(userId);
    }

    @GetMapping("/get/podcast/{userId}/episodes")
    public ResponseEntity<?> getAllPodcastEpisodes(@PathVariable String userId) {
        return episodeService.getEpisodesByUserId(userId);
    }

}
