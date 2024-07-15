package com.kgdatasolutions.podcastbackend.service;

import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface AdminService {
    ResponseEntity<?> getAllUsers();

    ResponseEntity<?> getUsersByQuery(String query);

    ResponseEntity<?> getUsersByCategory(String category);

    ResponseEntity<?> getLockedUsersByQuery(String query);

    ResponseEntity<?> lockUser(String userId);

    ResponseEntity<?> deleteUser(String userId) throws IOException;

    ResponseEntity<?> unlockUser(String userId);

    ResponseEntity<?> getLockedUsers();

    ResponseEntity<?> getLockedUsersByCategory(String category);
}
