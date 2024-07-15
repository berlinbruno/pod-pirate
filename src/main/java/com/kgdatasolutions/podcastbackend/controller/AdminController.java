package com.kgdatasolutions.podcastbackend.controller;

import com.kgdatasolutions.podcastbackend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;


    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        // Logic to retrieve list of users
        return adminService.getAllUsers();
    }

    @GetMapping("/users/query/{query}")
    public ResponseEntity<?> getUsersByQuery(@PathVariable String query) {
        return adminService.getUsersByQuery(query);
    }

    @GetMapping("/users/category/{category}")
    public ResponseEntity<?> getUsersByCategory(@PathVariable String category) {
        return adminService.getUsersByCategory(category);
    }

    @GetMapping("/users/locked")
    public ResponseEntity<?> getLockedUsers() {
        return adminService.getLockedUsers();
    }

    @GetMapping("/users/locked/query/{query}")
    public ResponseEntity<?> getLockedUsersByQuery(@PathVariable String query) {
        return adminService.getLockedUsersByQuery(query);
    }

    @GetMapping("/users/locked/category/{category}")
    public ResponseEntity<?> getLockedUsersByCategory(@PathVariable String category) {
        return adminService.getLockedUsersByCategory(category);
    }

    @PostMapping("/users/{userId}/lock")
    public ResponseEntity<?> lockAccount(@PathVariable String userId) {
        return adminService.lockUser(userId);
    }

    @PostMapping("/users/{userId}/unlock")
    public ResponseEntity<?> unlockAccount(@PathVariable String userId) {
        return adminService.unlockUser(userId);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteAccount(@PathVariable String userId) throws IOException {
        // Logic to delete the user account with given userId
        return adminService.deleteUser(userId);
    }

    // You can define more methods for other admin functionalities
}