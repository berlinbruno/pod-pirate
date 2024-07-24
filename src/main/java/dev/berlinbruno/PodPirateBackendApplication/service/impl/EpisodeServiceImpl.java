package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Episode;
import dev.berlinbruno.PodPirateBackendApplication.dto.episode.EpisodeResponse;
import dev.berlinbruno.PodPirateBackendApplication.mapper.EpisodeMapper;
import dev.berlinbruno.PodPirateBackendApplication.repository.AppUserRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.AzureBlobService;
import dev.berlinbruno.PodPirateBackendApplication.service.EpisodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class EpisodeServiceImpl implements EpisodeService {

    private final AzureBlobService azureBlobService;
    private final EpisodeMapper episodeMapper;
    private final AppUserRepository appUserRepository;


    @Override
    public ResponseEntity<?> getEpisodeByIndex(String userId, int episodeIndex) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser appUser = optionalAppUser.get();
                List<Episode> episodes = appUser.getEpisodes();

                if (episodes != null && episodeIndex >= 0 && episodeIndex < episodes.size()) {
                    Episode episode = episodes.get(episodeIndex); // Retrieve episode by index

//                  Generate signed URLs for image and audio files
                    String signedAudioUrl = episode.getAudioUrl() != null ? azureBlobService.generateSignedUrlForDownload(episode.getAudioUrl()) : null;

                    // Create a new EpisodeResponse object
                    EpisodeResponse response = new EpisodeResponse();
                    response.setTitle(episode.getTitle());
                    response.setDescription(episode.getDescription());
                    response.setAudioUrl(signedAudioUrl);
                    response.setPodcastId(episode.getUserId());
                    response.setDuration(episode.getDuration());
                    response.setEpisodeId(episodeIndex);

                    // Assuming other necessary properties are set similarly

                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.noContent().build(); // No content for invalid episode index
                }
            } else {
                return ResponseEntity.noContent().build(); // No content for podcast not found
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getEpisodesByUserId(String userId) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            AppUser appUser = optionalAppUser.get();
            List<Episode> episodes = appUser.getEpisodes();

            if (episodes.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Iterate through episodes and generate signed URLs
            for (Episode episode : episodes) {
                String audioUrl = episode.getAudioUrl();

                if (audioUrl != null) {
                    String signedAudioUrl = azureBlobService.generateSignedUrlForDownload(audioUrl);
                    episode.setAudioUrl(signedAudioUrl);
                }
            }

            // Map episodes to EpisodeResponse objects
            List<EpisodeResponse> response = IntStream.range(0, episodes.size())
                    .mapToObj(i -> episodeMapper.mapToEpisodeResponse(episodes.get(i), i))
                    .collect(Collectors.toList());


            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> createEpisode(String userId, String title, String description, String audioFile, String duration) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser existingAppUser = optionalAppUser.get();

                // Ensure episodes list is initialized
                if (existingAppUser.getEpisodes() == null) {
                    existingAppUser.setEpisodes(new ArrayList<>());
                }

                Episode newEpisode = new Episode();
                newEpisode.setTitle(title);
                newEpisode.setDescription(description);
                newEpisode.setUserId(userId);
                newEpisode.setDuration(Long.valueOf(duration));


                if (!audioFile.isEmpty()) {
                    String audioUrl = String.format("%s/%s/%s", existingAppUser.getId(), "audios", audioFile);
                    newEpisode.setAudioUrl(audioUrl);
                }

                existingAppUser.getEpisodes().add(newEpisode);
                appUserRepository.save(existingAppUser);

                return ResponseEntity.ok("Episode created successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> updateEpisode(String userId, int episodeIndex, String title, String description) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser existingAppUser = optionalAppUser.get();
                List<Episode> episodes = existingAppUser.getEpisodes();

                if (episodeIndex >= 0 && episodeIndex < episodes.size()) {
                    Episode existingEpisode = episodes.get(episodeIndex);

                    existingEpisode.setTitle(title);
                    existingEpisode.setDescription(description);


                    appUserRepository.save(existingAppUser);

                    return ResponseEntity.ok("Episode updated successfully");
                } else {
                    return ResponseEntity.notFound().build(); // Invalid episode index
                }
            } else {
                return ResponseEntity.notFound().build(); // Podcast not found
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> createEpisodeAudioUrl(String userId, String fileName) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                String uploadUrl = azureBlobService.generateSignedUrlForUpload(userId, "audios", fileName);
                return ResponseEntity.ok(uploadUrl);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> createUpdateEpisodeAudioUrl(String userId, int episodeIndex) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                String updateUrl = azureBlobService.generateSignedUrlForUpdate(optionalAppUser.get().getEpisodes().get(episodeIndex).getAudioUrl());
                return ResponseEntity.ok(updateUrl);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> deleteEpisodeByIndex(String userId, int episodeIndex) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser appUser = optionalAppUser.get();
                List<Episode> episodes = appUser.getEpisodes();

                if (episodes != null && episodeIndex >= 0 && episodeIndex < episodes.size()) {
                    Episode episodeToDelete = episodes.get(episodeIndex);

                    // Delete episode files
                    if (episodeToDelete.getAudioUrl() != null && !episodeToDelete.getAudioUrl().isEmpty()) {
                        System.out.println(episodeToDelete.getAudioUrl());
                        azureBlobService.deleteFileFromAzureBlob(episodeToDelete.getAudioUrl());
                    }

                    // Remove the episode from the list
                    episodes.remove(episodeIndex);

                    // Save the updated podcast
                    appUserRepository.save(appUser);

                    return ResponseEntity.ok("Episode deleted successfully");
                } else {
                    return ResponseEntity.notFound().build(); // Invalid episode index
                }
            } else {
                return ResponseEntity.notFound().build(); // Podcast not found
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to delete file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

}
