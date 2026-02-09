package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.RemoveUserRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.UpdateUserRequest;
import dev.berlinbruno.PodPirateBackendApplication.dto.appuser.UserProfileResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.creator.CreatorPublicResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.media.ImageUploadResponse;
import dev.berlinbruno.PodPirateBackendApplication.exception.AlreadyExistsException;
import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.repository.AppUserRepository;
import dev.berlinbruno.PodPirateBackendApplication.repository.PodcastRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.*;
import dev.berlinbruno.PodPirateBackendApplication.types.AppMessage;
import dev.berlinbruno.PodPirateBackendApplication.types.ImageExtension;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import dev.berlinbruno.PodPirateBackendApplication.types.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppUserServiceImpl implements AppUserService {

    private final MediaServiceImpl mediaServiceImpl;
    private final LookupService lookupService;
    private final DeletionService deletionService;
    private final CloudBlobService cloudBlobService;
    private final PodcastRepository podcastRepository;
    private final AppUserRepository appUserRepository;
    private final AuthValidationService authValidationService;

    // ==================== USER PROFILE MANAGEMENT ====================

    @Override
    public UserProfileResponse getProfileByEmail(String email) {
        AppUser appUser = lookupService.getByEmail(email);
        return mapToUserProfileResponse(appUser);
    }

    @Override
    public ImageUploadResponse generateProfileImageUploadUrl(String email, ImageExtension extension) {
        AppUser appUser = lookupService.getByEmail(email);
        String blobPath = buildProfileImageBlobPath(appUser.getId(), extension);
        String uploadUrl = cloudBlobService.generateSignedUrlForUpload(blobPath);

        return ImageUploadResponse.builder()
                .uploadUrl(uploadUrl)
                .blobPath(blobPath)
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String userId, UpdateUserRequest updateRequest) {
        AppUser appUser = lookupService.getById(userId);

        applyProfileUpdates(appUser, updateRequest);
        appUserRepository.save(appUser);

        return mapToUserProfileResponse(appUser);
    }

    @Override
    @Transactional
    public UserProfileResponse removeProfile(String userId, RemoveUserRequest removeRequest) {
        AppUser appUser = lookupService.getById(userId);

        applyProfileRemovals(appUser, removeRequest);
        appUserRepository.save(appUser);

        return mapToUserProfileResponse(appUser);
    }

    @Override
    @Transactional
    public void deleteAccount(String userId, String verificationToken) {
        AppUser appUser = lookupService.getById(userId);
        authValidationService.validateEmailAndTokenEmail(appUser.getEmail(), verificationToken, TokenType.VERIFICATION);
        deletionService.deleteUser(appUser);
    }

    // ==================== PUBLIC CREATOR PROFILES ====================

    @Override
    public CreatorPublicResponse getCreatorPublicProfile(String userId) {
        AppUser appUser = lookupService.getById(userId);
        return mapToCreatorPublicResponse(appUser);
    }

    // ==================== VALIDATION HELPERS ====================

    private void validateUsernameUniqueness(String username, String currentUsername) {
        if (!username.equals(currentUsername) && appUserRepository.existsByUsername(username)) {
            throw new AlreadyExistsException(buildGeneralResponse(
                    HttpStatus.CONFLICT, AppMessage.USERNAME_ALREADY_EXISTS));
        }
    }

    private GeneralResponse buildGeneralResponse(HttpStatus status, AppMessage message) {
        return new GeneralResponse(status, message.getCode(), message.getMessage(), message.getDetail());
    }

    // ==================== BUSINESS LOGIC HELPERS ====================

    private void applyProfileUpdates(AppUser appUser, UpdateUserRequest updateRequest) {
        if (updateRequest.getUsername() != null) {
            validateUsernameUniqueness(updateRequest.getUsername(), appUser.getGenericUsername());
            appUser.setUsername(updateRequest.getUsername().toLowerCase());
        }

        if (updateRequest.getBio() != null) {
            appUser.setBio(updateRequest.getBio());
        }

        if (updateRequest.getProfileUrl() != null) {
            mediaServiceImpl.replaceFileIfChanged(updateRequest.getProfileUrl(), appUser.getProfileUrl());
            appUser.setProfileUrl(updateRequest.getProfileUrl());
        }
    }

    private void applyProfileRemovals(AppUser appUser, RemoveUserRequest removeRequest) {
        if (removeRequest.isBio()) {
            appUser.setBio(null);
        }

        if (removeRequest.isProfileUrl()) {
            mediaServiceImpl.deleteIfExists(appUser.getProfileUrl());
            appUser.setProfileUrl(null);
        }
    }

    private String buildProfileImageBlobPath(String userId, ImageExtension extension) {
        return String.format("media/users/%s/profile/%s.%s",
                userId, java.util.UUID.randomUUID(), extension.name());
    }

    // ==================== MAPPER METHODS ====================

    private UserProfileResponse mapToUserProfileResponse(AppUser appUser) {
        long podcastCount = podcastRepository.countByUserId(appUser.getId());

        return UserProfileResponse.builder()
                .userId(appUser.getId())
                .email(appUser.getEmail())
                .username(appUser.getGenericUsername())
                .bio(appUser.getBio())
                .profileUrl(mediaServiceImpl.getDownloadUrl(appUser.getProfileUrl()))
                .roles(appUser.getRoles())
                .podcastCount(podcastCount)
                .joinedDate(appUser.getCreatedAt())
                .lastLoginDate(appUser.getLastLoginAt())
                .updatedDate(appUser.getLastModifiedAt())
                .build();
    }

    private CreatorPublicResponse mapToCreatorPublicResponse(AppUser appUser) {
        long podcastCount = podcastRepository.countByUserIdAndPodcastStatus(
                appUser.getId(), PodcastStatus.PUBLISHED);

        return CreatorPublicResponse.builder()
                .creatorId(appUser.getId())
                .creatorName(appUser.getGenericUsername())
                .bio(appUser.getBio())
                .profileUrl(mediaServiceImpl.getDownloadUrl(appUser.getProfileUrl()))
                .joinedDate(appUser.getCreatedAt())
                .podcastCount(podcastCount)
                .build();
    }
}