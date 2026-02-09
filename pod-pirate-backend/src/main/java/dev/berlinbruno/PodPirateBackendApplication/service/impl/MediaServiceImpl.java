package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.service.CloudBlobService;
import dev.berlinbruno.PodPirateBackendApplication.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final CloudBlobService cloudBlobService;

    public String getDownloadUrl(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }
        return cloudBlobService.generateSignedUrlForDownload(filePath);
    }

    public void validateFileExists(String filePath) {
        if (filePath != null && !filePath.isEmpty()) {
            cloudBlobService.verifyFileUpload(filePath);
        }
    }

    public void deleteIfExists(String filePath) {
        if (filePath != null && !filePath.isEmpty()) {
            cloudBlobService.deleteFile(filePath);
        }
    }

    public void replaceFileIfChanged(String newUrl, String oldUrl) {
        validateFileExists(newUrl);
        if (oldUrl != null && !oldUrl.equals(newUrl)) {
            deleteIfExists(oldUrl);
        }
    }
}

