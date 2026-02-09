package dev.berlinbruno.PodPirateBackendApplication.service;

public interface MediaService {
    String getDownloadUrl(String filePath);

    void validateFileExists(String filePath);

    void deleteIfExists(String filePath);

    void replaceFileIfChanged(String newUrl, String oldUrl);
}
