package com.kgdatasolutions.podcastbackend.controller;


import com.kgdatasolutions.podcastbackend.dto.auth.AuthReqResDto;
import com.kgdatasolutions.podcastbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody AuthReqResDto signUpRequest) {
        return authService.signUp(signUpRequest);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody AuthReqResDto signInRequest) {
        return authService.signIn(signInRequest);
    }

    @DeleteMapping("/signout")
    public ResponseEntity<?> signOut(@RequestBody AuthReqResDto signOutRequest) {
        return authService.signOut(signOutRequest);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody AuthReqResDto changePasswordRequest) {
        return authService.changePassword(changePasswordRequest);
    }

    @PutMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody AuthReqResDto resetPasswordRequest) {
        return authService.resetPassword(resetPasswordRequest);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody AuthReqResDto refreshTokenRequest) {
        return authService.refreshToken(refreshTokenRequest);
    }
}
