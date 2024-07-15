package com.kgdatasolutions.podcastbackend.service.impl;

import com.kgdatasolutions.podcastbackend.Model.AppUser;
import com.kgdatasolutions.podcastbackend.Model.Episode;
import com.kgdatasolutions.podcastbackend.Utils.JWTUtils;
import com.kgdatasolutions.podcastbackend.dto.auth.AuthReqResDto;
import com.kgdatasolutions.podcastbackend.dto.auth.Auth_Role;
import com.kgdatasolutions.podcastbackend.dto.auth.Auth_Status;
import com.kgdatasolutions.podcastbackend.repository.AppUserRepository;
import com.kgdatasolutions.podcastbackend.service.AuthService;
import com.kgdatasolutions.podcastbackend.service.AzureBlobService;
import com.kgdatasolutions.podcastbackend.service.EpisodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository appUserRepository;
    private final JWTUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AzureBlobService azureBlobService;
    private final EpisodeService episodeService;

    @Override
    public ResponseEntity<?> signUp(AuthReqResDto registrationRequest) {
        AuthReqResDto response = new AuthReqResDto();
        try {
            // Check if any admin user already exists
            Optional<AppUser> adminUser = appUserRepository.findByRole("ADMIN");

            if (adminUser.isPresent() && Objects.equals(registrationRequest.getRole().toString(), "ADMIN")) {
                response.setStatus(Auth_Status.ADMIN_ALREADY_EXISTS);
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            Optional<AppUser> existingUser = appUserRepository.findByEmail(registrationRequest.getEmail());

            if (existingUser.isPresent()) {
                response.setStatus(Auth_Status.USER_ALREADY_EXISTS);
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            AppUser newUser = new AppUser();
            newUser.setName(registrationRequest.getName());
            newUser.setEmail(registrationRequest.getEmail());
            newUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            newUser.setRole(registrationRequest.getRole().toString());
            newUser.setSecurityAnswer1(registrationRequest.getSecurityAnswer1());
            newUser.setSecurityAnswer2(registrationRequest.getSecurityAnswer2());
            newUser.setSecurityAnswer3(registrationRequest.getSecurityAnswer3());
            newUser.setCategory(registrationRequest.getCategory());
            newUser.setTitle(registrationRequest.getTitle());
            newUser.setDescription(registrationRequest.getDescription());
            appUserRepository.save(newUser);
            response.setStatus(Auth_Status.USER_CREATED_SUCCESSFULLY);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setError(e.getMessage());
            response.setStatus(Auth_Status.USER_REGISTRATION_FAILED);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @Override
    public ResponseEntity<?> signIn(AuthReqResDto signInRequest) {
        AuthReqResDto response = new AuthReqResDto();

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword()));
            var user = appUserRepository.findByEmail(signInRequest.getEmail()).orElseThrow();
            System.out.println("USER IS: " + user);
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setName(user.getName());
            response.setId(user.getId());
            response.setRole(Auth_Role.valueOf(user.getRole()));
            response.setStatus(Auth_Status.LOGIN_SUCCESS);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        } catch (Exception e) {
            response.setError(e.getMessage());
            response.setStatus(Auth_Status.LOGIN_FAILED);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<?> refreshToken(AuthReqResDto refreshTokenRequest) {
        AuthReqResDto response = new AuthReqResDto();
        try {

            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            AppUser users = appUserRepository.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setStatus(Auth_Status.TOKEN_REFRESH_SUCCESSFULLY);
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                response.setStatus(Auth_Status.TOKEN_REFRESH_FAILED);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            response.setError(e.getMessage());
            response.setStatus(Auth_Status.TOKEN_REFRESH_FAILED);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<?> signOut(AuthReqResDto signOutRequest) {
        AuthReqResDto response = new AuthReqResDto();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signOutRequest.getEmail(), signOutRequest.getPassword()));
            var user = appUserRepository.findByEmail(signOutRequest.getEmail()).orElseThrow();

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

            response.setStatus(Auth_Status.USER_DELETED_SUCCESSFULLY);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.setError(e.getMessage());
            response.setStatus(Auth_Status.USER_DELETION_FAILED);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @Override
    public ResponseEntity<?> changePassword(AuthReqResDto changePasswordRequest) {
        AuthReqResDto response = new AuthReqResDto();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(changePasswordRequest.getEmail(), changePasswordRequest.getPassword())); // Use the old password for authentication
            Optional<AppUser> existingUserOptional = appUserRepository.findByEmail(changePasswordRequest.getEmail());
            if (existingUserOptional.isPresent()) {
                AppUser existingUser = existingUserOptional.get();
                // Update the password
                existingUser.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword())); // Encode the new password
                appUserRepository.save(existingUser);
                response.setStatus(Auth_Status.PASSWORD_CHANGED_SUCCESSFULLY);
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                response.setStatus(Auth_Status.USER_NOT_FOUND);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (Exception e) {
            response.setStatus(Auth_Status.PASSWORD_UPDATE_FAILED);
            response.setError(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Override
    public ResponseEntity<?> resetPassword(AuthReqResDto resetPasswordRequest) {
        AuthReqResDto response = new AuthReqResDto();
        try {
            // Fetch user by email
            var userOptional = appUserRepository.findByEmail(resetPasswordRequest.getEmail());
            if (userOptional.isPresent()) {
                var user = userOptional.get();

                // Check if at least two security answers match
                int correctAnswers = 0;
                if (resetPasswordRequest.getSecurityAnswer1().equals(user.getSecurityAnswer1())) {
                    correctAnswers++;
                }
                if (resetPasswordRequest.getSecurityAnswer2().equals(user.getSecurityAnswer2())) {
                    correctAnswers++;
                }
                if (resetPasswordRequest.getSecurityAnswer3().equals(user.getSecurityAnswer3())) {
                    correctAnswers++;
                }

                if (correctAnswers >= 2) {
                    // Generate new password (you need to implement this method)
                    String newPassword = resetPasswordRequest.getNewPassword();

                    // Update user password in the database
                    user.setPassword(passwordEncoder.encode(newPassword));
                    appUserRepository.save(user);

                    // Set success response
                    response.setStatus(Auth_Status.PASSWORD_RESET_SUCCESSFULLY);
                    return ResponseEntity.status(HttpStatus.OK).body(response);
                } else {
                    // Set error response for insufficient correct answers
                    response.setStatus(Auth_Status.INSUFFICIENT_SECURITY_ANSWERS);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
            } else {
                // Set error response for user not found
                response.setStatus(Auth_Status.USER_NOT_FOUND);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            // Set error response for any other unexpected error
            response.setStatus(Auth_Status.ERROR_OCCURRED);
            response.setError(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
