package com.kgdatasolutions.podcastbackend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface AppUserService {

    ResponseEntity<?> deleteProfileImage(String userId);

    ResponseEntity<?> updateProfile(String userId, String name, String title, String description, Optional<MultipartFile> imageFile, Optional<MultipartFile> bannerUrl);

    ResponseEntity<?> deleteBannerImage(String userId);

}
