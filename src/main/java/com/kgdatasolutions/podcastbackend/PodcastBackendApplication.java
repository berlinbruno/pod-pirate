package com.kgdatasolutions.podcastbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class PodcastBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PodcastBackendApplication.class, args);
    }

}
