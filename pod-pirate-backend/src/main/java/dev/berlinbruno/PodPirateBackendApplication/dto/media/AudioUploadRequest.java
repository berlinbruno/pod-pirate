package dev.berlinbruno.PodPirateBackendApplication.dto.media;

import dev.berlinbruno.PodPirateBackendApplication.types.AudioExtension;
import dev.berlinbruno.PodPirateBackendApplication.types.AudioType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioUploadRequest {
    @NotNull(message = "Extension is required")
    private AudioExtension extension; // "mp3", "wav", "aac", etc.

    @NotNull(message = "Audio type is required")
    private AudioType audioType;
}
