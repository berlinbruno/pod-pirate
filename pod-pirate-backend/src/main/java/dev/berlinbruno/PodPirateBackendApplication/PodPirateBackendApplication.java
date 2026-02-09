package dev.berlinbruno.PodPirateBackendApplication;

import dev.berlinbruno.PodPirateBackendApplication.properties.FrontendProperties;
import dev.berlinbruno.PodPirateBackendApplication.properties.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@EnableMongoAuditing
@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, FrontendProperties.class})
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class PodPirateBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PodPirateBackendApplication.class, args);
    }

}
