package com.kgdatasolutions.podcastbackend.Model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class Episode {
    @NotBlank(message = "Title should not be empty")
    private String title;

    @Size(min = 20, max = 250, message = "Description should be between 20 to 250 characters")
    private String description;

    @NotBlank(message = "Audio should not be empty")
    private String audioUrl;

    @NotNull(message = "Duration should not be empty")
    private Long duration;

    @NotBlank(message = "UserId should not be empty")
    private String userId;

}
