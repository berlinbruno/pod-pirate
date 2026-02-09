package dev.berlinbruno.PodPirateBackendApplication.dto.media;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AudioUploadResponse {
    private String blobPath;
    private String uploadUrl;
}
