package com.kgdatasolutions.podcastbackend.service.impl;

import com.kgdatasolutions.podcastbackend.Model.AppUser;
import com.kgdatasolutions.podcastbackend.dto.podcast.PodcastResponse;
import com.kgdatasolutions.podcastbackend.mapper.PodcastMapper;
import com.kgdatasolutions.podcastbackend.repository.AppUserRepository;
import com.kgdatasolutions.podcastbackend.service.PodcastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PodcastServiceImpl implements PodcastService {

    private final AppUserRepository appUserRepository;
    private final PodcastMapper podcastMapper;
    private final MongoTemplate mongoTemplate;

    @Override
    public ResponseEntity<?> getAllPodcasts() {
        try {

            Query query = new Query();

            // Retrieve all AppUsers containing podcasts
            query.with(Sort.by(Sort.Direction.DESC, "lastModifiedAt"));
            List<AppUser> appUsers = mongoTemplate.find(query, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            // Check if no podcasts are found
            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<PodcastResponse> response = new ArrayList<>();

            // Iterate through each AppUser
            for (AppUser appUser : filteredUsers) {
                // Map AppUser to PodcastResponse using PodcastMapper
                PodcastResponse podcastResponse = podcastMapper.mapToPodcastResponse(appUser);
                // Add the podcast to the response list
                response.add(podcastResponse);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getPodcastsByUserId(String userId) {
        try {
            Optional<AppUser> optionalAppUser = appUserRepository.findById(userId);
            if (optionalAppUser.isPresent()) {
                AppUser appUser = optionalAppUser.get();
                // Map the AppUser to PodcastResponse
                PodcastResponse response = podcastMapper.mapToPodcastResponse(appUser);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }


    @Override
    public ResponseEntity<?> getPodcastsByUserQuery(String userQuery) {
        try {
            Query query = new Query();
            Criteria criteria = new Criteria().orOperator(
                    Criteria.where("title").regex(userQuery, "i"),
                    Criteria.where("description").regex(userQuery, "i"),
                    Criteria.where("category").regex(userQuery, "i"),
                    Criteria.where("name").regex(userQuery, "i")
            );
            query.addCriteria(criteria);
            query.with(Sort.by(Sort.Direction.DESC, "lastModifiedAt"));

            List<AppUser> appUserList = mongoTemplate.find(query, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUserList.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Map retrieved Podcast entities to PodcastResponse DTOs using PodcastMapper
            List<PodcastResponse> response = filteredUsers.stream()
                    .map(podcastMapper::mapToPodcastResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getPodcastsByCategory(String category) {
        try {
            Query query = new Query();
            query.addCriteria(Criteria.where("category").regex(category, "i"));
            query.with(Sort.by(Sort.Direction.DESC, "lastModifiedAt"));

            List<AppUser> appUsers = mongoTemplate.find(query, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Map retrieved AppUser entities to PodcastResponse DTOs using PodcastMapper
            List<PodcastResponse> response = filteredUsers.stream()
                    .map(podcastMapper::mapToPodcastResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getPodcastsSortedByDate() {
        try {
            Query query = new Query().with(Sort.by(Sort.Direction.DESC, "createdAt"));
            List<AppUser> appUsers = mongoTemplate.find(query, AppUser.class);

            // Filter out users with the admin role
            List<AppUser> filteredUsers = appUsers.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole()))
                    .toList();

            if (filteredUsers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            // Map retrieved AppUser entities to PodcastResponse DTOs using PodcastMapper
            List<PodcastResponse> response = filteredUsers.stream()
                    .map(podcastMapper::mapToPodcastResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error occurred: " + e.getMessage());
        }
    }

}
