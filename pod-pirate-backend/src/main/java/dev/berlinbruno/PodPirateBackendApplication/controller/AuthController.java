package dev.berlinbruno.PodPirateBackendApplication.controller;

import dev.berlinbruno.PodPirateBackendApplication.dto.auth.*;
import dev.berlinbruno.PodPirateBackendApplication.service.AuthService;
import dev.berlinbruno.PodPirateBackendApplication.types.VerificationType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication and user account management.
 * Handles user registration, login, email verification, password management, and session control.
 * All POST operations are non-idempotent state changes.
 *
 * @author Pod Pirate Team
 * @version 1.0
 * @since 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
@Tag(
        name = "Authentication & Account",
        description = "User authentication, registration, email verification, and password management endpoints. " +
                "Supports JWT-based authentication with refresh token rotation."
)
public class AuthController {

    private final AuthService authService;

    // ==================== USER REGISTRATION ====================

    /**
     * Registers a new user account and initiates email verification.
     *
     * @param registerRequest User registration details
     * @return Registration response with user ID and verification status
     */
    @Operation(
            summary = "Register new user account",
            description = "Creates a new user account with the provided details. " +
                    "Sends a verification email to the provided email address. " +
                    "Account must be verified before login is permitted. " +
                    "No authentication required - this is a public endpoint.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "User successfully registered, verification email sent",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid registration data - validation failed (e.g., weak password, invalid email format)"),
                    @ApiResponse(responseCode = "409", description = "Email address already registered - user with this email already exists"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(
            @Valid @RequestBody
            @Parameter(description = "User registration details including email, password, and profile information", required = true)
            RegisterRequest registerRequest
    ) {
        RegisterResponse response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    // ==================== AUTHENTICATION ====================

    /**
     * Authenticates a user and generates access and refresh tokens.
     *
     * @param loginRequest User credentials
     * @return Login response with access and refresh tokens
     */
    @Operation(
            summary = "User login",
            description = "Authenticates a user with email and password. " +
                    "Returns access token (short-lived, ~15 minutes) and refresh token (long-lived, ~7 days). " +
                    "Account must be email-verified to login. " +
                    "No authentication required - this is a public endpoint.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully authenticated, tokens generated",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid request data - validation failed"),
                    @ApiResponse(responseCode = "401", description = "Invalid credentials (wrong email/password) or email not verified"),
                    @ApiResponse(responseCode = "403", description = "Account locked by administrator or suspended"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(
            @Valid @RequestBody
            @Parameter(description = "User login credentials (email and password)", required = true)
            LoginRequest loginRequest
    ) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Refreshes an access token using a valid refresh token.
     *
     * @param refreshToken Valid refresh token
     * @return New access token and new refresh token
     */
    @Operation(
            summary = "Refresh access token",
            description = "Generates a new access token using a valid refresh token. " +
                    "Implements token rotation for security - old refresh token is invalidated " +
                    "and a new refresh token is issued. " +
                    "Use this endpoint when the access token expires. " +
                    "Refresh token must be provided in 'Refresh-Token' header.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Access token successfully refreshed, new tokens issued",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RefreshTokenResponse.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid refresh token format - token is malformed"),
                    @ApiResponse(responseCode = "401", description = "Invalid, expired, or revoked refresh token"),
                    @ApiResponse(responseCode = "403", description = "Account locked or suspended - cannot refresh token"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> generateAccessToken(
            @RequestHeader("Refresh-Token")
            @Parameter(description = "Valid refresh token from login or previous refresh", required = true)
            @NotBlank String refreshToken
    ) {
        RefreshTokenResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    /**
     * Logs out a user by invalidating their tokens.
     *
     * @param accessToken Current access token
     * @param signOutRequest Sign-out request with refresh token
     */
    @Operation(
            summary = "User logout",
            description = "Invalidates the current user session by revoking the access and refresh tokens. " +
                    "After logout, the tokens can no longer be used for authentication. " +
                    "Both access token (in Authorization header) and refresh token (in request body) must be provided. " +
                    "Authentication required - access token must be valid.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Successfully logged out, tokens invalidated"),
                    @ApiResponse(responseCode = "400", description = "Invalid request data - missing refresh token in request body"),
                    @ApiResponse(responseCode = "401", description = "Invalid or expired access token"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(
            @RequestHeader("Authorization")
            @Parameter(description = "Bearer access token", required = true)
            @NotBlank String accessToken,
            @Valid @RequestBody
            @Parameter(description = "Sign-out request with refresh token to invalidate", required = true)
            SignOutRequest signOutRequest
    ) {
        authService.signOut(accessToken, signOutRequest);
        return ResponseEntity.noContent().build();
    }

    // ==================== EMAIL VERIFICATION ====================

    /**
     * Requests a verification token to be sent to the user's email.
     *
     * @param email User's email address
     * @param type Type of verification (EMAIL or PASSWORD_RESET)
     */
    @Operation(
            summary = "Request verification token",
            description = "Sends a verification token to the specified email address. " +
                    "Used for email verification during registration or password reset. " +
                    "Email is sent asynchronously - endpoint returns immediately (202 Accepted). " +
                    "For security, returns 202 even if email doesn't exist to prevent email enumeration. " +
                    "Rate limited to prevent abuse. " +
                    "No authentication required - this is a public endpoint.",
            responses = {
                    @ApiResponse(responseCode = "202", description = "Request accepted - verification email will be sent if email exists in system"),
                    @ApiResponse(responseCode = "400", description = "Invalid email format or verification type"),
                    @ApiResponse(responseCode = "404", description = "Email address not found"),
                    @ApiResponse(responseCode = "429", description = "Too many verification requests - please wait before trying again"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/verification-token")
    public ResponseEntity<Void> requestVerificationToken(
            @RequestParam
            @Parameter(description = "Email address to send verification token to", required = true)
            @Email @NotBlank String email,
            @RequestParam
            @Parameter(description = "Type of verification: EMAIL (account verification) or PASSWORD_RESET", required = true)
            VerificationType type
    ) {
        authService.sendVerificationToken(email, type);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    /**
     * Verifies a user's email address using the token sent via email.
     *
     * @param token Verification token from email
     * @param email User's email address
     */
    @Operation(
            summary = "Verify email address",
            description = "Verifies a user's email address using the verification token sent via email. " +
                    "Once verified, the user can login to their account. " +
                    "Verification tokens expire after 24 hours. " +
                    "No authentication required - this is a public endpoint.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Email successfully verified, account activated"),
                    @ApiResponse(responseCode = "400", description = "Invalid, expired, or already used verification token"),
                    @ApiResponse(responseCode = "404", description = "Email address not found"),
                    @ApiResponse(responseCode = "409", description = "Email already verified"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyUserEmail(
            @RequestParam
            @Parameter(description = "6-digit verification token from email", required = true)
            @NotBlank String token,
            @RequestParam
            @Parameter(description = "Email address being verified", required = true)
            @Email @NotBlank String email
    ) {
        authService.verifyEmail(token, email);
        return ResponseEntity.noContent().build();
    }

    // ==================== PASSWORD MANAGEMENT ====================

    /**
     * Changes the password for an authenticated user.
     *
     * @param accessToken Current access token
     * @param changePasswordRequest Password change request with current and new password
     */
    @Operation(
            summary = "Change password (authenticated)",
            description = "Updates the password for an authenticated user. " +
                    "Requires the current password for verification. " +
                    "All active sessions will be invalidated after password change. " +
                    "Authentication required - access token must be valid.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Password successfully changed, all sessions invalidated"),
                    @ApiResponse(responseCode = "400", description = "Invalid password format or passwords don't match requirements"),
                    @ApiResponse(responseCode = "401", description = "Invalid access token or incorrect current password"),
                    @ApiResponse(responseCode = "422", description = "New password must be different from current password"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/password/change")
    public ResponseEntity<Void> updatePassword(
            @RequestHeader("Authorization")
            @Parameter(description = "Bearer access token", required = true)
            @NotBlank String accessToken,
            @Valid @RequestBody
            @Parameter(description = "Current password and new password", required = true)
            ChangePasswordRequest changePasswordRequest
    ) {
        authService.changePassword(accessToken, changePasswordRequest);
        return ResponseEntity.noContent().build();
    }

    /**
     * Resets a user's password using a verification token.
     *
     * @param token Password reset token from email
     * @param resetPasswordRequest New password details
     */
    @Operation(
            summary = "Reset forgotten password",
            description = "Resets a user's password using a verification token sent via email. " +
                    "Used when user has forgotten their password. " +
                    "All active sessions will be invalidated after password reset. " +
                    "Reset tokens expire after 1 hour. " +
                    "No authentication required - this is a public endpoint.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Password successfully reset, all sessions invalidated"),
                    @ApiResponse(responseCode = "400", description = "Invalid password format or token"),
                    @ApiResponse(responseCode = "401", description = "Invalid, expired, or already used reset token"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetUserPassword(
            @RequestParam
            @Parameter(description = "Password reset token from email", required = true)
            @NotBlank String token,
            @Valid @RequestBody
            @Parameter(description = "New password meeting security requirements", required = true)
            ResetPasswordRequest resetPasswordRequest
    ) {
        authService.resetPassword(token, resetPasswordRequest);
        return ResponseEntity.noContent().build();
    }
}
