package dev.berlinbruno.PodPirateBackendApplication.dto.media;

import dev.berlinbruno.PodPirateBackendApplication.types.ImageExtension;
import dev.berlinbruno.PodPirateBackendApplication.types.ImageType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadRequest {
    @NotNull(message = "Extension is required")
    private ImageExtension extension; // "jpg", "png", "webp"

    @NotNull(message = "Image type is required")
    private ImageType imageType;
}
