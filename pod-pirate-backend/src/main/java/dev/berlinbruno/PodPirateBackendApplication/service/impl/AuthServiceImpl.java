package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.dto.auth.*;
import dev.berlinbruno.PodPirateBackendApplication.exception.AlreadyExistsException;
import dev.berlinbruno.PodPirateBackendApplication.exception.InvalidResourceException;
import dev.berlinbruno.PodPirateBackendApplication.exception.ResourceUnavailableException;
import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.repository.AppUserRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.AuthService;
import dev.berlinbruno.PodPirateBackendApplication.service.AuthValidationService;
import dev.berlinbruno.PodPirateBackendApplication.service.EmailService;
import dev.berlinbruno.PodPirateBackendApplication.service.LookupService;
import dev.berlinbruno.PodPirateBackendApplication.types.AccountRoles;
import dev.berlinbruno.PodPirateBackendApplication.types.AppMessage;
import dev.berlinbruno.PodPirateBackendApplication.types.TokenType;
import dev.berlinbruno.PodPirateBackendApplication.types.VerificationType;
import dev.berlinbruno.PodPirateBackendApplication.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static dev.berlinbruno.PodPirateBackendApplication.constants.ApplicationConstants.ROLES;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$"
    );

    private final AppUserRepository appUserRepository;
    private final JWTUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AuthValidationService authValidationService;
    private final EmailService emailService;
    private final LookupService lookupService;
    private final MediaServiceImpl mediaServiceImpl;

    @Value("${app.admin.email}")
    private String adminEmail;

    // ==================== REGISTRATION & LOGIN ====================

    @Override
    public RegisterResponse register(RegisterRequest registerRequest) {
        validateUserDoesNotExist(registerRequest);
        validatePasswordStrength(registerRequest.getPassword());

        AppUser newUser = createUserFromRequest(registerRequest);
        appUserRepository.save(newUser);

        sendVerificationEmail(newUser);

        return buildRegisterResponse(newUser);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        AppUser user = lookupService.getByEmail(loginRequest.getEmail());

        validateUserCanLogin(user);
        authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

        updateLastLoginTime(user);

        return buildLoginResponse(user);
    }

    // ==================== TOKEN OPERATIONS ====================

    @Override
    public RefreshTokenResponse refreshToken(String refreshToken) {
        AppUser user = authValidationService.validateEmailAndTokenEmail(null, refreshToken, TokenType.REFRESH);
        return buildRefreshTokenResponse(user);
    }

    @Override
    public void signOut(String accessToken, SignOutRequest signoutRequest) {
        AppUser user = authValidationService.validateEmailAndTokenEmail(
                signoutRequest.getEmail(), accessToken, TokenType.ACCESS);
        authenticateUser(user.getEmail(), signoutRequest.getPassword());

        user.unVerifyEmail();
        appUserRepository.save(user);
    }

    // ==================== EMAIL VERIFICATION ====================

    @Override
    public void verifyEmail(String verificationToken, String email) {
        AppUser user = authValidationService.validateEmailAndTokenEmail(
                email, verificationToken, TokenType.VERIFICATION);
        user.verifyEmail();
        appUserRepository.save(user);
    }

    @Override
    public void sendVerificationToken(String email, VerificationType type) {
        AppUser user = lookupService.getByEmail(email);
        String verificationToken = jwtUtils.generateVerificationToken(user);
        emailService.sendEmailWithRetry(user.getEmail(), verificationToken, type);
    }

    // ==================== PASSWORD MANAGEMENT ====================

    @Override
    public void changePassword(String accessToken, ChangePasswordRequest changePasswordRequest) {
        AppUser user = authValidationService.validateEmailAndTokenEmail(
                changePasswordRequest.getEmail(), accessToken, TokenType.ACCESS);
        authenticateUser(user.getEmail(), changePasswordRequest.getPassword());

        validatePasswordStrength(changePasswordRequest.getNewPassword());
        updateUserPassword(user, changePasswordRequest.getNewPassword());
    }

    @Override
    public void resetPassword(String verificationToken, ResetPasswordRequest resetPasswordRequest) {
        AppUser user = authValidationService.validateEmailAndTokenEmail(
                resetPasswordRequest.getEmail(), verificationToken, TokenType.VERIFICATION);

        validatePasswordsMatch(resetPasswordRequest.getNewPassword(),
                              resetPasswordRequest.getConfirmPassword());
        validatePasswordStrength(resetPasswordRequest.getNewPassword());
        updateUserPassword(user, resetPasswordRequest.getNewPassword());
    }

    // ==================== VALIDATION HELPERS ====================

    private void validateUserDoesNotExist(RegisterRequest registerRequest) {
        if (appUserRepository.existsByEmail(registerRequest.getEmail())) {
            throw buildAlreadyExistsException(AppMessage.USER_ALREADY_EXISTS);
        }
        if (appUserRepository.existsByUsername(registerRequest.getUsername())) {
            throw buildAlreadyExistsException(AppMessage.USERNAME_ALREADY_EXISTS);
        }
    }

    private void validateUserCanLogin(AppUser user) {
        if (!user.isEnabled()) {
            throw buildResourceUnavailableException(
                    HttpStatus.NOT_ACCEPTABLE, AppMessage.ACCOUNT_NEED_VERIFICATION);
        }
        if (!user.isAccountNonLocked()) {
            throw buildResourceUnavailableException(
                    HttpStatus.LOCKED, AppMessage.USER_LOCKED);
        }
    }

    private void validatePasswordStrength(String password) {
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw buildInvalidResourceException(AppMessage.WEAK_PASSWORD);
        }
    }

    private void validatePasswordsMatch(String newPassword, String confirmPassword) {
        if (!Objects.equals(newPassword, confirmPassword)) {
            throw buildInvalidResourceException(AppMessage.PASSWORD_NOT_MATCH);
        }
    }

    private void validateAdminDoesNotExist() {
        if (appUserRepository.findByRoles(AccountRoles.ADMIN.name()).isPresent()) {
            throw buildAlreadyExistsException(AppMessage.ADMIN_ALREADY_EXISTS);
        }
    }

    // ==================== EXCEPTION BUILDERS ====================

    private AlreadyExistsException buildAlreadyExistsException(AppMessage message) {
        return new AlreadyExistsException(buildGeneralResponse(HttpStatus.CONFLICT, message));
    }

    private ResourceUnavailableException buildResourceUnavailableException(HttpStatus status, AppMessage message) {
        return new ResourceUnavailableException(buildGeneralResponse(status, message));
    }

    private InvalidResourceException buildInvalidResourceException(AppMessage message) {
        return new InvalidResourceException(buildGeneralResponse(HttpStatus.BAD_REQUEST, message));
    }

    private GeneralResponse buildGeneralResponse(HttpStatus status, AppMessage message) {
        return new GeneralResponse(status, message.getCode(), message.getMessage(), message.getDetail());
    }

    // ==================== BUSINESS LOGIC HELPERS ====================

    private AppUser createUserFromRequest(RegisterRequest registerRequest) {
        AppUser newUser = new AppUser();
        newUser.setUsername(registerRequest.getUsername().toLowerCase());
        newUser.setEmail(registerRequest.getEmail().toLowerCase());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRoles(determineUserRoles(registerRequest.getEmail()));

        if (registerRequest.getBio() != null) {
            newUser.setBio(registerRequest.getBio());
        }

        return newUser;
    }

    private Set<String> determineUserRoles(String email) {
        if (Objects.equals(email, adminEmail)) {
            validateAdminDoesNotExist();
            return filterRoles(AccountRoles.ADMIN);
        }
        return filterRoles(AccountRoles.USER);
    }

    private Set<String> filterRoles(AccountRoles role) {
        return ROLES.stream()
                .filter(r -> r.equals(role.name()))
                .collect(Collectors.toSet());
    }

    private void authenticateUser(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
    }

    private void updateLastLoginTime(AppUser user) {
        user.setLastLoginAt(getCurrentUtcDate());
        appUserRepository.save(user);
    }

    private void updateUserPassword(AppUser user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        appUserRepository.save(user);
    }

    private void sendVerificationEmail(AppUser user) {
        String verificationToken = jwtUtils.generateVerificationToken(user);
        emailService.sendEmailWithRetry(user.getEmail(), verificationToken, VerificationType.EMAIL);
    }

    private Date getCurrentUtcDate() {
        return Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant());
    }

    // ==================== RESPONSE BUILDERS ====================

    private RegisterResponse buildRegisterResponse(AppUser user) {
        return RegisterResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .username(user.getGenericUsername())
                .emailVerificationRequired(true)
                .build();
    }

    private LoginResponse buildLoginResponse(AppUser user) {
        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .userName(user.getGenericUsername())
                .profileUrl(mediaServiceImpl.getDownloadUrl(user.getProfileUrl()))
                .roles(user.getRoles())
                .accessToken(jwtUtils.generateToken(user))
                .refreshToken(jwtUtils.generateRefreshToken(user))
                .build();
    }

    private RefreshTokenResponse buildRefreshTokenResponse(AppUser user) {
        return RefreshTokenResponse.builder()
                .accessToken(jwtUtils.generateToken(user))
                .refreshToken(jwtUtils.generateRefreshToken(user))
                .build();
    }
}
