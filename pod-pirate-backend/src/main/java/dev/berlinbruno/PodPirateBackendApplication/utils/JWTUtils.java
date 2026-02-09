package dev.berlinbruno.PodPirateBackendApplication.utils;

import dev.berlinbruno.PodPirateBackendApplication.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

/**
 * Utility class for handling JWT (JSON Web Token) creation, validation, and parsing.
 * Provides methods to generate access tokens and refresh tokens, as well as verify token validity and expiration.
 * This class is used for securing API endpoints with JWT-based authentication.
 */
@Component
public class JWTUtils {

    private final long accessTokenExpirationMillis;
    private final long refreshTokenExpirationMillis;
    private final long verificationTokenExpirationMillis;
    private final SecretKey key;

    /**
     * Constructor initializes the secret key used for signing the JWT tokens.
     * The secret key is decoded from a Base64 encoded string.
     */
    public JWTUtils(JwtProperties props) {
        this.accessTokenExpirationMillis =
                TimeUnit.DAYS.toMillis(props.accessTokenExpiration());

        this.refreshTokenExpirationMillis =
                TimeUnit.DAYS.toMillis(props.refreshTokenExpiration());

        this.verificationTokenExpirationMillis =
                TimeUnit.MINUTES.toMillis(props.verificationTokenExpiration());

        byte[] keyBytes = Base64.getDecoder().decode(props.secret());
        this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }


    /**
     * Generates a JWT access token for the specified user details.
     * The token includes the username, issued at timestamp, and expiration time.
     *
     * @param userDetails The details of the user for whom the token is generated.
     * @return A JWT token as a string.
     */
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis())) // Set the issue date to the current time
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpirationMillis)) // Set the expiration date (24 hours)
                .signWith(key) // Sign the token with the predefined secret key
                .compact(); // Compact the JWT into a string and return
    }

    /**
     * Generates a refresh token with additional claims for the specified user details.
     * The token includes custom claims, issued at timestamp, and expiration time.
     *
     * @param userDetails The details of the user for whom the token is generated.
     * @return A JWT refresh token as a string.
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject("#refresh" + userDetails.getUsername()) // Set the username as the subject of the token
                .issuedAt(new Date(System.currentTimeMillis())) // Set the issue date to the current time
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpirationMillis)) // Set the expiration date (24 hours)
                .signWith(key) // Sign the token with the predefined secret key
                .compact(); // Compact the JWT into a string and return
    }

    /**
     * Generates a verification token with additional claims for the specified user details.
     * The token includes custom claims, issued at timestamp, and expiration time.
     *
     * @param userDetails The details of the user for whom the token is generated.
     * @return A JWT refresh token as a string.
     */
    public String generateVerificationToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject("#verification" + userDetails.getUsername()) // Set the username as the subject of the token
                .issuedAt(new Date(System.currentTimeMillis())) // Set the issue date to the current time
                .expiration(new Date(System.currentTimeMillis() + verificationTokenExpirationMillis)) // Set the expiration date (24 hours)
                .signWith(key) // Sign the token with the predefined secret key
                .compact(); // Compact the JWT into a string and return
    }

    /**
     * Extracts the username from a JWT token.
     *
     * @param token The JWT token.
     * @return The username extracted from the token's claims.
     */
    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject); // Extract the subject (username) from the token
    }

    /**
     * Extracts specific claims from a JWT token using a provided function.
     * This function can be used to extract any claim, such as the expiration date or custom claims.
     *
     * @param token           The JWT token.
     * @param claimsTFunction A function to extract a specific claim from the token.
     * @param <T>             The type of the claim.
     * @return The extracted claim.
     */
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        // Parse the token and apply the claimsExtractor function to retrieve the desired claim
        return claimsTFunction.apply(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
    }

    /**
     * Validates a JWT token by checking its username and expiration.
     * The token is considered valid if the username matches and the token is not expired.
     *
     * @param token       The JWT token.
     * @param userDetails The user details to compare against.
     * @return True if the token is valid, false otherwise.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token); // Extract the username from the token
        // Check if the extracted username matches and if the token is not expired
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token).substring(8);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public Boolean isVerificationTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token).substring(13);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Checks if a JWT token has expired.
     * The token is considered expired if its expiration date is before the current time.
     *
     * @param token The JWT token.
     * @return True if the token is expired, false otherwise.
     */
    public boolean isTokenExpired(String token) {
        // True if the expiration date is before now (i.e., token IS expired)
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }
}
