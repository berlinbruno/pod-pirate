package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.dto.auth.*;
import dev.berlinbruno.PodPirateBackendApplication.types.VerificationType;

public interface AuthService {
    RegisterResponse register(RegisterRequest registerRequest);

    LoginResponse login(LoginRequest loginRequest);

    RefreshTokenResponse refreshToken(String refreshToken);

    void signOut(String accessToken, SignOutRequest signoutRequest);

    void verifyEmail(String verificationToken, String email);

    void changePassword(String accessToken, ChangePasswordRequest changePasswordRequest);

    void resetPassword(String verificationToken, ResetPasswordRequest resetPasswordRequest);

    void sendVerificationToken(String email, VerificationType type);
}
