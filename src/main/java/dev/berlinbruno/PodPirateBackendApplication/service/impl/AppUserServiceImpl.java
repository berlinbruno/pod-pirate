package dev.berlinbruno.PodPirateBackendApplication.service.impl;


import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.repository.AppUserRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.AppUserService;
import dev.berlinbruno.PodPirateBackendApplication.service.AzureBlobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserServiceImpl implements AppUserService {

    private final AppUserRepository appUserRepository;
    private final AzureBlobService azureBlobService;


    @Override
    public ResponseEntity<?> updateProfile(String userId, String name, String title, String description, Optional<MultipartFile> imageFile, Optional<MultipartFile> bannerFile) {
        try {
            if (name == null || name.isEmpty()) {
                return ResponseEntity.badRequest().body("Name cannot be empty");
            }

            if (title == null || title.isEmpty()) {
                return ResponseEntity.badRequest().body("Title cannot be empty");
            }

            if (description == null || description.isEmpty()) {
                return ResponseEntity.badRequest().body("Description cannot be empty");
            }


            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser appUser = optionalAppUser.get();

                // Update name
                appUser.setName(name);
                appUser.setTitle(title);
                appUser.setDescription(description);

                // Update profile image if provided
                if (imageFile != null && imageFile.isPresent()) {
                    MultipartFile image = imageFile.get();
                    String profileUrl = appUser.getProfileUrl();
                    if (profileUrl == null || profileUrl.isEmpty()) {
                        appUser.setProfileUrl(azureBlobService.saveFileToAzureBlob(userId, "images", image));
                    } else {
                        appUser.setProfileUrl(azureBlobService.updateFileInAzureBlob(profileUrl, image));
                    }
                }

                // Update banner image if provided
                if (bannerFile != null && bannerFile.isPresent()) {
                    MultipartFile image = bannerFile.get();
                    String bannerUrl = appUser.getBannerUrl();
                    if (bannerUrl == null || bannerUrl.isEmpty()) {
                        appUser.setBannerUrl(azureBlobService.saveFileToAzureBlob(userId, "images", image));
                    } else {
                        appUser.setBannerUrl(azureBlobService.updateFileInAzureBlob(bannerUrl, image));
                    }
                }

                appUserRepository.save(appUser);
                if (imageFile != null && imageFile.isPresent()) {
                    return ResponseEntity.ok("Profile updated successfully with image");
                } else {
                    return ResponseEntity.ok("Profile updated successfully without image");
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error occurred while processing the image file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Internal server error: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> deleteProfileImage(String userId) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser appUser = optionalAppUser.get();
                String profileUrl = appUser.getProfileUrl();
                if (profileUrl == null || profileUrl.isEmpty()) {
                    return ResponseEntity.notFound().build();
                } else {
                    azureBlobService.deleteFileFromAzureBlob(appUser.getProfileUrl());
                    appUser.setProfileUrl(null);
                    appUserRepository.save(appUser);
                    return ResponseEntity.ok("Profile image removed successfully");
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error occurred while processing the image file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Internal server error: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> deleteBannerImage(String userId) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser appUser = optionalAppUser.get();
                String bannerUrl = appUser.getBannerUrl();
                if (bannerUrl == null || bannerUrl.isEmpty()) {
                    return ResponseEntity.notFound().build();
                } else {
                    azureBlobService.deleteFileFromAzureBlob(appUser.getBannerUrl());
                    appUser.setBannerUrl(null);
                    appUserRepository.save(appUser);
                    return ResponseEntity.ok("Banner image removed successfully");
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error occurred while processing the banner image file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Internal server error: " + e.getMessage());
        }
    }

}
