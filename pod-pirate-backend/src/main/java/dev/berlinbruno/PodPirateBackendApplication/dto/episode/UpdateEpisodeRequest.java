package dev.berlinbruno.PodPirateBackendApplication.dto.episode;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateEpisodeRequest {
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @Size(min = 10, max = 500, message = "Description must be between 10 to 300 characters")
    private String description;

    private String imageUrl;
    private String audioUrl;

    @Min(value = 1, message = "Duration must be at least 1 second")
    private Long durationSeconds;
}
