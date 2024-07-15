package com.kgdatasolutions.podcastbackend.service;

import org.springframework.http.ResponseEntity;

public interface EpisodeService {

    ResponseEntity<?> getEpisodeByIndex(String userId, int episodeIndex);

    ResponseEntity<?> getEpisodesByUserId(String userId);

    ResponseEntity<?> createEpisode(String userId, String title, String description, String audioFile, String duration);

    ResponseEntity<?> updateEpisode(String userId, int episodeIndex, String title, String description);

    ResponseEntity<?> createEpisodeAudioUrl(String userId, String fileName);

    ResponseEntity<?> createUpdateEpisodeAudioUrl(String userId, int episodeIndex);

    ResponseEntity<?> deleteEpisodeByIndex(String userId, int episodeIndex);
}
