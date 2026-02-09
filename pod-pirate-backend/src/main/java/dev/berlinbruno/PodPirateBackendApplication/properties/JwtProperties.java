package dev.berlinbruno.PodPirateBackendApplication.properties;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(

        @Min(1)
        long accessTokenExpiration,        // days

        @Min(1)
        long refreshTokenExpiration,       // days

        @Min(1)
        long verificationTokenExpiration,  // minutes

        @NotBlank
        String secret
) {
}
