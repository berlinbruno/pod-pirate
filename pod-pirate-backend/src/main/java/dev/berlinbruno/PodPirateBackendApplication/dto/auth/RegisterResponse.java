package dev.berlinbruno.PodPirateBackendApplication.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private String userId;
    private String email;
    private String username;
    private boolean emailVerificationRequired;
}

