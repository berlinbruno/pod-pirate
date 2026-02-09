package dev.berlinbruno.PodPirateBackendApplication.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String userId;
    private String email;
    private String userName;
    private String profileUrl;
    private Set<String> roles;
    private String accessToken;
    private String refreshToken;
}
