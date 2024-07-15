package com.kgdatasolutions.podcastbackend.service.impl;

import com.kgdatasolutions.podcastbackend.Model.AppUser;
import com.kgdatasolutions.podcastbackend.Model.Episode;
import com.kgdatasolutions.podcastbackend.dto.admin.AdminResponse;
import com.kgdatasolutions.podcastbackend.mapper.AdminMapper;
import com.kgdatasolutions.podcastbackend.repository.AppUserRepository;
import com.kgdatasolutions.podcastbackend.service.AdminService;
import com.kgdatasolutions.podcastbackend.service.AzureBlobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AzureBlobService azureBlobService;
    private final AppUserRepository appUserRepository;
    private final AdminMapper adminMapper;
    private final MongoTemplate mongoTemplate;

    @Override
    public ResponseEntity<?> getAllUsers() {
        try {
            // Retrieve all AppUsers
            List<AppUser> appUsers = appUserRepository.findAll();

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            // Check if no users are found after filtering
            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Map filtered AppUser to AdminResponse using AdminMapper
            List<AdminResponse> adminResponses = filteredUsers.stream()
                    .map(adminMapper::mapToAdminResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(adminResponses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getUsersByQuery(String query) {
        try {
            Criteria queryCriteria = buildQueryCriteria(query);

            Query mongoQuery = new Query(queryCriteria);

            List<AppUser> appUsers = mongoTemplate.find(mongoQuery, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<AdminResponse> adminResponses = filteredUsers.stream()
                    .map(adminMapper::mapToAdminResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(adminResponses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getUsersByCategory(String category) {
        try {
            Criteria categoryCriteria = buildCategoryCriteria(category);

            Query mongoQuery = new Query(categoryCriteria);

            List<AppUser> appUsers = mongoTemplate.find(mongoQuery, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<AdminResponse> adminResponses = filteredUsers.stream()
                    .map(adminMapper::mapToAdminResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(adminResponses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getLockedUsersByQuery(String query) {
        try {
            Criteria queryCriteria = buildQueryCriteria(query);
            // Add criteria for locked users
            queryCriteria.and("locked").is(true);

            Query mongoQuery = new Query(queryCriteria);

            List<AppUser> appUsers = mongoTemplate.find(mongoQuery, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<AdminResponse> adminResponses = filteredUsers.stream()
                    .map(adminMapper::mapToAdminResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(adminResponses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    private Criteria buildQueryCriteria(String query) {
        return new Criteria().orOperator(
                Criteria.where("name").regex(query, "i"),
                Criteria.where("title").regex(query, "i"),
                Criteria.where("description").regex(query, "i"),
                Criteria.where("category").regex(query, "i")
        );
    }

    private Criteria buildCategoryCriteria(String category) {
        if (category != null && !category.isEmpty()) {
            return Criteria.where("category").is(category);
        }
        return new Criteria();
    }


    @Override
    public ResponseEntity<?> lockUser(String userId) {
        Optional<AppUser> optionalUser = appUserRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();
            user.lock(); // Lock the user account
            appUserRepository.save(user);
            return ResponseEntity.ok("User account locked successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<?> deleteUser(String userId) throws IOException {
        Optional<AppUser> optionalUser = appUserRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();
            // Delete all episodes associated with the user
            if (user.getEpisodes() != null && !user.getEpisodes().isEmpty()) {
                for (Episode episode : user.getEpisodes()) {
                    // Delete episode file from GCS
                    azureBlobService.deleteFileFromAzureBlob(episode.getAudioUrl());
                }
            }

            // Check if the user has a profile URL
            if (user.getProfileUrl() != null) {
                azureBlobService.deleteFileFromAzureBlob(user.getProfileUrl());
            }

            // Check if the user has a banner URL
            if (user.getBannerUrl() != null) {
                azureBlobService.deleteFileFromAzureBlob(user.getBannerUrl());
            }

            // Delete the user
            appUserRepository.deleteById(user.getId());
            return ResponseEntity.ok("User account deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<?> unlockUser(String userId) {
        Optional<AppUser> optionalUser = appUserRepository.findById(userId);
        if (optionalUser.isPresent()) {
            AppUser user = optionalUser.get();
            user.unlock(); // Unlock the user account
            appUserRepository.save(user);
            return ResponseEntity.ok("User account unlocked successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<?> getLockedUsers() {
        try {
            // Retrieve locked users from the UserRepository
            List<AppUser> lockedUsers = appUserRepository.findByLocked(true);

            // Check if no locked users are found
            if (lockedUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Map locked users to AdminResponse using AdminMapper
            List<AdminResponse> lockedUserResponses = lockedUsers.stream()
                    .map(adminMapper::mapToAdminResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(lockedUserResponses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getLockedUsersByCategory(String category) {
        try {
            Criteria categoryCriteria = buildCategoryCriteria(category);

            categoryCriteria.and("locked").is(true);

            Query mongoQuery = new Query(categoryCriteria);

            List<AppUser> appUsers = mongoTemplate.find(mongoQuery, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<AdminResponse> adminResponses = filteredUsers.stream()
                    .map(adminMapper::mapToAdminResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(adminResponses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }
}
