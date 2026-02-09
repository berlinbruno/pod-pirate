package dev.berlinbruno.PodPirateBackendApplication.dto.podcast;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdatePodcastRequest {
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(min = 10, max = 300, message = "Description must be between 10 and 300 characters")
    private String description;

    private String category;
    private String coverUrl;
    private String bannerUrl;
}
