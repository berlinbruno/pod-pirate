package dev.berlinbruno.PodPirateBackendApplication.controller;

import dev.berlinbruno.PodPirateBackendApplication.service.AppUserService;
import dev.berlinbruno.PodPirateBackendApplication.service.EpisodeService;
import dev.berlinbruno.PodPirateBackendApplication.service.PodcastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;


@RestController
@Slf4j
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final EpisodeService episodeService;
    private final AppUserService appUserService;
    private final PodcastService podcastService;


    @GetMapping("/get/userdata/{userId}")
    public ResponseEntity<?> getUserDataByUserId(@PathVariable String userId) {
        return podcastService.getPodcastsByUserId(userId);
    }

    @GetMapping("/get/episode/{userId}/{episodeIndex}")
    public ResponseEntity<?> getEpisodeById(@PathVariable String userId, @PathVariable int episodeIndex) {
        return episodeService.getEpisodeByIndex(userId, episodeIndex);
    }

    @GetMapping("/get/podcast/{userId}/episodes")
    public ResponseEntity<?> getAllPodcastEpisodes(@PathVariable String userId) {
        return episodeService.getEpisodesByUserId(userId);
    }

    @PostMapping("/update/profile/{userId}")
    public ResponseEntity<?> UpdateProfile(@PathVariable String userId, @RequestParam String name, @RequestParam String title, @RequestParam String description, @RequestParam Optional<MultipartFile> imageFile, @RequestParam Optional<MultipartFile> bannerFile) {
        return appUserService.updateProfile(userId, name, title, description, imageFile, bannerFile);
    }


    @PostMapping("/create/episode/{userId}")
    public ResponseEntity<?> createEpisode(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String audioFile,
            @RequestParam String duration,
            @PathVariable String userId) {
        try {
            return episodeService.createEpisode(userId, title, description, audioFile, duration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while creating the episode " + e.getMessage());
        }
    }

    @GetMapping("/get/episode/uploadAudioUrl/{userId}/{fileName}")
    public ResponseEntity<?> createEpisodeAudioUrl(
            @PathVariable String fileName,
            @PathVariable String userId) {
        try {
            return episodeService.createEpisodeAudioUrl(userId, fileName);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while creating the episode " + e.getMessage());
        }
    }

    @GetMapping("/get/episode/updateAudioUrl/{userId}/{episodeIndex}")
    public ResponseEntity<?> updateEpisodeAudioUrl(
            @PathVariable String userId,
            @PathVariable int episodeIndex) {
        try {
            return episodeService.createUpdateEpisodeAudioUrl(userId, episodeIndex);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating the episode " + e.getMessage());
        }
    }


    @PutMapping("/update/episode/{userId}/{episodeIndex}")
    public ResponseEntity<?> updateEpisode(
            @RequestParam String title,
            @RequestParam String description,
            @PathVariable int episodeIndex,
            @PathVariable String userId) {
        try {
            return episodeService.updateEpisode(userId, episodeIndex, title, description);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating the episode " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/profileImage/{userId}")
    public ResponseEntity<?> deleteUserProfileImage(@PathVariable String userId) {
        try {
            return appUserService.deleteProfileImage(userId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while deleting the profile image: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/bannerImage/{userId}")
    public ResponseEntity<?> deleteUserBannerImage(@PathVariable String userId) {
        try {
            return appUserService.deleteBannerImage(userId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while deleting the banner image: " + e.getMessage());
        }
    }


    @DeleteMapping("/delete/episode/{userId}/{episodeIndex}")
    public ResponseEntity<?> deleteEpisode(@PathVariable String userId, @PathVariable int episodeIndex) {
        try {
            return episodeService.deleteEpisodeByIndex(userId, episodeIndex);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while deleting the episode: " + e.getMessage());
        }
    }
}
