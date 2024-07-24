package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.dto.auth.AuthReqResDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> signUp(AuthReqResDto signUpRequest);

    ResponseEntity<?> signIn(AuthReqResDto signInRequest);

    ResponseEntity<?> signOut(AuthReqResDto signOutRequest);

    ResponseEntity<?> changePassword(AuthReqResDto changePasswordRequest);

    ResponseEntity<?> refreshToken(AuthReqResDto refreshTokenRequest);

    ResponseEntity<?> resetPassword(AuthReqResDto resetPasswordRequest);

}
