package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.types.TokenType;

public interface AuthValidationService {
    void validateEmailMatch(String requestEmail, String tokenEmail);

    void validateOwnership(Podcast podcast, String userId);

    AppUser validateEmailAndTokenEmail(
            String email,
            String token,
            TokenType type
    );
}
