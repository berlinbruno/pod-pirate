package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.exception.ForbiddenException;
import dev.berlinbruno.PodPirateBackendApplication.exception.InvalidResourceException;
import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.service.AuthValidationService;
import dev.berlinbruno.PodPirateBackendApplication.service.LookupService;
import dev.berlinbruno.PodPirateBackendApplication.types.AppMessage;
import dev.berlinbruno.PodPirateBackendApplication.types.TokenType;
import dev.berlinbruno.PodPirateBackendApplication.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class AuthValidationServiceImpl implements AuthValidationService {

    private final JWTUtils jwtUtils;
    private final LookupService lookupService;

    @Override
    public void validateEmailMatch(String requestEmail, String tokenEmail) {
        if (!Objects.equals(requestEmail, tokenEmail)) {
            throw new InvalidResourceException(new GeneralResponse(
                    HttpStatus.CONFLICT,
                    AppMessage.EMAIL_TOKEN_MISMATCH.getCode(),
                    AppMessage.EMAIL_TOKEN_MISMATCH.getMessage(),
                    AppMessage.EMAIL_TOKEN_MISMATCH.getDetail()
            ));
        }
    }

    @Override
    public void validateOwnership(Podcast podcast, String userId) {
        if (!podcast.getUserId().equals(userId)) {
            throw new ForbiddenException(
                    new GeneralResponse(
                            HttpStatus.FORBIDDEN,
                            AppMessage.PODCAST_ACCESS_FORBIDDEN.getCode(),
                            AppMessage.PODCAST_ACCESS_FORBIDDEN.getMessage(),
                            "User " + userId + " is not the owner of podcast " + podcast.getId()
                    )
            );
        }
    }

    @Override
    public AppUser validateEmailAndTokenEmail(
            String email,
            String token,
            TokenType type
    ) {
        switch (type) {
            case TokenType.VERIFICATION:
                if (jwtUtils.extractUsername(token).startsWith("#verification")) {
                    String tokenEmail = jwtUtils.extractUsername(token).substring(13);
                    validateEmailMatch(email, tokenEmail);
                    AppUser user = lookupService.getByEmail(tokenEmail);
                    if (!jwtUtils.isVerificationTokenValid(token, user)) {
                        throw new InvalidResourceException(new GeneralResponse(
                                HttpStatus.NOT_ACCEPTABLE,
                                AppMessage.INVALID_VERIFICATION_TOKEN.getCode(),
                                AppMessage.INVALID_VERIFICATION_TOKEN.getMessage(),
                                AppMessage.INVALID_VERIFICATION_TOKEN.getDetail()
                        ));
                    }

                    return user;
                } else {
                    throw new InvalidResourceException(new GeneralResponse(
                            HttpStatus.NOT_ACCEPTABLE,
                            AppMessage.INVALID_VERIFICATION_TOKEN.getCode(),
                            AppMessage.INVALID_VERIFICATION_TOKEN.getMessage(),
                            AppMessage.INVALID_VERIFICATION_TOKEN.getDetail()
                    ));
                }

            case TokenType.REFRESH:
                if (jwtUtils.extractUsername(token).startsWith("#refresh")) {
                    String tokenEmail = jwtUtils.extractUsername(token).substring(8);
                    AppUser user = lookupService.getByEmail(tokenEmail);
                    if (!jwtUtils.isRefreshTokenValid(token, user)) {
                        throw new InvalidResourceException(new GeneralResponse(
                                HttpStatus.NOT_ACCEPTABLE,
                                AppMessage.INVALID_REFRESH_TOKEN.getCode(),
                                AppMessage.INVALID_REFRESH_TOKEN.getMessage(),
                                AppMessage.INVALID_REFRESH_TOKEN.getDetail()
                        ));
                    }

                    return user;
                } else {
                    throw new InvalidResourceException(new GeneralResponse(
                            HttpStatus.NOT_ACCEPTABLE,
                            AppMessage.INVALID_REFRESH_TOKEN.getCode(),
                            AppMessage.INVALID_REFRESH_TOKEN.getMessage(),
                            AppMessage.INVALID_REFRESH_TOKEN.getDetail()
                    ));
                }

            case TokenType.ACCESS: {
                String cleanToken = token.startsWith("Bearer ") ? token.substring(7).trim() : token;
                String tokenEmail = jwtUtils.extractUsername(cleanToken);
                if (email != null) {
                    validateEmailMatch(email, tokenEmail);
                }
                AppUser user = lookupService.getByEmail(tokenEmail);
                if (!jwtUtils.isTokenValid(cleanToken, user)) {
                    throw new InvalidResourceException(new GeneralResponse(
                            HttpStatus.NOT_ACCEPTABLE,
                            AppMessage.INVALID_ACCESS_TOKEN.getCode(),
                            AppMessage.INVALID_ACCESS_TOKEN.getMessage(),
                            AppMessage.INVALID_ACCESS_TOKEN.getDetail()
                    ));
                }
                return user;
            }
        }
        throw new InvalidResourceException(new GeneralResponse(
                HttpStatus.NOT_ACCEPTABLE,
                AppMessage.INVALID_TOKEN.getCode(),
                AppMessage.INVALID_TOKEN.getMessage(),
                AppMessage.INVALID_TOKEN.getDetail()
        ));
    }
}

