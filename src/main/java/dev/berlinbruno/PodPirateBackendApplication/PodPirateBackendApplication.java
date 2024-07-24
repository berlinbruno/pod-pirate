package dev.berlinbruno.PodPirateBackendApplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class PodPirateBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PodPirateBackendApplication.class, args);
    }

}
