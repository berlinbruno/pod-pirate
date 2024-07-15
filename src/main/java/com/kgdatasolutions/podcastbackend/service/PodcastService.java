package com.kgdatasolutions.podcastbackend.service;

import org.springframework.http.ResponseEntity;

public interface PodcastService {
    ResponseEntity<?> getAllPodcasts();

    ResponseEntity<?> getPodcastsByUserId(String userId);

    ResponseEntity<?> getPodcastsByUserQuery(String query);

    ResponseEntity<?> getPodcastsByCategory(String category);

    ResponseEntity<?> getPodcastsSortedByDate();
}
