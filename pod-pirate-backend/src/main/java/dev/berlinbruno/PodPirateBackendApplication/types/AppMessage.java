package dev.berlinbruno.PodPirateBackendApplication.types;

import lombok.Getter;

@Getter
public enum AppMessage {
    // User Messages
    USER_LOCKED("USER_LOCKED", "User account is locked", "The account is locked. Please contact support."),
    USER_UNLOCKED("USER_UNLOCKED", "User account is unlocked", "The account has been unlocked."),
    EMAIL_ALREADY_EXISTS("EMAIL_ALREADY_EXISTS", "Email already exists", "Try logging in or use a different email"),
    USERNAME_ALREADY_EXISTS("USERNAME_ALREADY_EXISTS", "Username already exists", "Choose a different username"),
    USER_ALREADY_EXISTS("USER_ALREADY_EXISTS", "User already exists", "Try logging in instead"),
    USER_REGISTERED("USER_REGISTERED", "User registered successfully", "You can now log in with your credentials"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid username or password", "Please check your login details"),
    ACCOUNT_LOCKED("ACCOUNT_LOCKED", "Account is locked", "Too many failed login attempts. Try again later."),
    REGISTRATION_SUCCESS("REGISTRATION_SUCCESS", "Registration successful", "Please verify your email to activate your account"),
    LOGIN_SUCCESS("LOGIN_SUCCESS", "Login successful", "Welcome back"),
    LOGOUT_SUCCESS("LOGOUT_SUCCESS", "Logout successful", "You have been logged out successfully"),
    PASSWORD_RESET_REQUESTED("PASSWORD_RESET_REQUESTED", "Password reset requested", "Check your email for reset instructions"),
    PASSWORD_RESET_SUCCESS("PASSWORD_RESET_SUCCESS", "Password has been reset successfully", "You can now log in with your new password"),
    EMAIL_VERIFICATION_SENT("EMAIL_VERIFICATION_SENT", "Email verification link has been sent", "Please check your email to verify your account"),
    EMAIL_VERIFIED_SUCCESS("EMAIL_VERIFIED_SUCCESS", "Email has been verified successfully", "You can now log in to your account"),
    USER_UPDATED("USER_UPDATED", "User updated successfully", "The user details have been successfully updated"),
    ACCOUNT_NEED_VERIFICATION("ACCOUNT_NEED_VERIFICATION", "Account needs verification", "Please verify your email to proceed"),
    TOKEN_CREATED("TOKEN_CREATED", "Token created successfully", "A new token has been generated"),
    USER_DELETED("USER_DELETED", "User deleted successfully", "The user has been successfully deleted"),
    USER_NOT_FOUND("USER_NOT_FOUND", "User not found", "No user exists with the provided identifier"),

    // Auth Service Messages
    ADMIN_ALREADY_EXISTS("ADMIN_ALREADY_EXISTS", "Admin already exists", "An admin with this email already exists"),
    INVALID_VERIFICATION_TOKEN("INVALID_VERIFICATION_TOKEN", "Token is invalid or expired", "Request a new token"),
    INVALID_REFRESH_TOKEN("INVALID_REFRESH_TOKEN", "Token is invalid or expired", "Request a new token"),
    INVALID_ACCESS_TOKEN("INVALID_ACCESS_TOKEN", "Token is invalid or expired", "Request a new token"),
    INVALID_TOKEN("INVALID_TOKEN", "Token is invalid or expired", "Request a new token"),
    EMAIL_TOKEN_MISMATCH("EMAIL_TOKEN_MISMATCH", "Email mismatch with token", "Ensure the token corresponds to the provided email"),
    EMAIL_SENDING_FAILED("EMAIL_SENDING_FAILED", "Failed to send verification token", "Please try again later or contact support"),
    WEAK_PASSWORD("WEAK_PASSWORD", "Password does not meet security requirements", "Password must be 6-20 characters, with lowercase, uppercase, number, and special character"),
    PASSWORD_NOT_MATCH("PASSWORD_NOT_MATCH", "Passwords do not match", "Please ensure that both password fields match."),
    SIGN_OUT_SUCCESSFULLY("SIGN_OUT_SUCCESSFULLY", "Your account has been disabled. You can reverify your email to regain access.", "If you wish to continue using our services, please verify your email again."),
    PASSWORD_CHANGED("PASSWORD_CHANGED", "Password changed successfully", "Your password has been updated. You can now use your new password."),
    PASSWORD_RESET("PASSWORD_RESET", "Password reset successfully", "Your password has been reset. You can now log in with the new password."),
    VERIFICATION_TOKEN_SENT("VERIFICATION_TOKEN_SENT", "Verification token sent", "A verification token has been sent to your email. Please follow the instructions to verify your account."),

    // Episode Service Messages
    EPISODE_CREATED("EPISODE_CREATED", "Episode creation successful", "A new episode has been successfully added to the podcast."),
    EPISODE_UPDATED("EPISODE_UPDATED", "Episode update successful", "The episode has been successfully updated."),
    EPISODE_DELETED("EPISODE_DELETED", "Episode successfully deleted", "The episode has been successfully removed from the podcast."),
    EPISODE_NOT_FOUND("EPISODE_NOT_FOUND", "Episode not found in the podcast", "No episode exists at the given index"),
    EPISODE_FORBIDDEN_TO_PUBLISH("EPISODE_FORBIDDEN_TO_PUBLISH", "You don't have permission to publish this episode", "Episode publishing is restricted due to content violations or account status"),
    EPISODE_MISSING_ASSETS("EPISODE_MISSING_ASSETS", "Episode is missing required assets", "Please ensure all necessary assets are uploaded before publishing"),
    EPISODE_MISSING_AUDIO("EPISODE_MISSING_AUDIO", "Episode audio is missing", "Please upload an audio file before publishing the episode."),

    // Podcast Service Messages
    PODCAST_NOT_FOUND("PODCAST_NOT_FOUND", "Podcast entity not provided", "Podcast does not exist"),
    PODCAST_CREATED("PODCAST_CREATED", "Podcast successfully created", "Podcast successfully created"),
    PODCAST_UPDATED("PODCAST_UPDATED", "Podcast successfully updated", "Podcast successfully updated"),
    PODCAST_DELETED("PODCAST_DELETED", "Podcast successfully deleted", "Podcast successfully deleted"),
    PODCAST_ACCESS_FORBIDDEN("PODCAST_ACCESS_FORBIDDEN", "You don't have permission to access this podcast", "You are not the owner of this podcast"),
    PODCAST_ALREADY_FLAGGED("PODCAST_ALREADY_FLAGGED", "Podcast is already flagged", "This podcast has already been flagged for review"),
    PODCAST_NOT_FLAGGED("PODCAST_NOT_FLAGGED", "Podcast is not flagged", "This podcast is not currently flagged and cannot be unflagged"),
    PODCAST_FORBIDDEN_TO_PUBLISH("PODCAST_FORBIDDEN_TO_PUBLISH", "You don't have permission to publish this podcast", "Podcast publishing is restricted due to content violations or account status"),
    PODCAST_MISSING_ASSETS("PODCAST_MISSING_ASSETS", "Podcast is missing required assets", "Please ensure all necessary assets are uploaded before publishing"),
    PODCAST_MISSING_EPISODE("PODCAST_MISSING_EPISODE", "Podcast has no episodes", "Please add at least one episode before publishing"),

    // User Management Messages
    USER_ALREADY_LOCKED("USER_ALREADY_LOCKED", "User account is already locked", "This user is already locked and cannot be locked again"),
    USER_NOT_LOCKED("USER_NOT_LOCKED", "User account is not locked", "This user is not locked and cannot be unlocked"),

    // File Upload Messages
    FILE_UPLOAD_INCOMPLETE("FILE_UPLOAD_INCOMPLETE", "The file upload appears to be incomplete or the file is not available yet", "Please try again later or re-upload the file"),

    // Token and Security Messages
    TOKEN_EXPIRED("TOKEN_EXPIRED", "The provided token has expired", "Please obtain a new token by re-authenticating or contact support if the issue persists"),
    TOKEN_INVALID("TOKEN_INVALID", "The provided token is invalid or malformed", "Ensure you are using a valid token. Re-authenticate or contact support if the issue persists"),
    INVALID_REQUEST("INVALID_REQUEST", "Invalid request parameters", "Please check your request parameters and try again"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "An unexpected error occurred", "Please try again later or contact support if the issue persists"),
    MISSING_REQUEST_PARAMETER("MISSING_REQUEST_PARAMETER", "A required request parameter is missing", "Please ensure all required parameters are included in your request");

    private final String code;
    private final String message;
    private final String detail;

    AppMessage(String code, String message, String detail) {
        this.code = code;
        this.message = message;
        this.detail = detail;
    }
}

