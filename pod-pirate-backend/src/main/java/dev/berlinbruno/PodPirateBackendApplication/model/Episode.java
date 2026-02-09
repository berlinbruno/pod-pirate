package dev.berlinbruno.PodPirateBackendApplication.model;

import dev.berlinbruno.PodPirateBackendApplication.types.EpisodeStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Episode {

    @NotBlank(message = "Title should not be empty")
    @Size(min = 3, max = 100, message = "Title should be between 3 and 100 characters")
    private String title;

    @Size(min = 10, max = 300, message = "Description should be between 10 to 300 characters")
    private String description;

    private String imageUrl;

    private String audioUrl;

    @NotNull(message = "Duration should not be empty")
    @Min(value = 1, message = "Duration should be at least 1 second")
    private Long durationSeconds;

    private EpisodeStatus episodeStatus;

    private Date createdAt;

    private Date updatedAt;

    private Date publishedAt;

}
