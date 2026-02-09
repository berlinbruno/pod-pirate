package dev.berlinbruno.PodPirateBackendApplication.dto.appuser;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateUserRequest {
    @Size(min = 3, max = 20, message = "Username should be between 3 to 20 characters")
    @Pattern(
            regexp = "^(?:[a-z]*\\d){0,3}[a-z]*$",
            message = "Username can contain lowercase letters and up to 3 digits only"
    )
    private String username;

    @Size(max = 100, message = "Bio should not exceed 100 characters")
    private String bio;

    private String profileUrl;
}

