package dev.berlinbruno.PodPirateBackendApplication;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Basic smoke test to verify the application context loads successfully.
 * Note: This test requires MongoDB and all environment variables to be properly configured.
 * For CI/CD environments, ensure proper test profiles or mocks are configured.
 */
@SpringBootTest
@ActiveProfiles("test")
class PodcastBackendApplicationTests {

    @Test
    void contextLoads() {
        // This test will pass if the application context loads successfully
    }

}
