package dev.berlinbruno.PodPirateBackendApplication.service;

public interface CloudBlobService {

    String generateSignedUrlForDownload(String filePath);

    String generateSignedUrlForUpload(String filePath);

    void verifyFileUpload(String filePath);

    void deleteFile(String filePath);

}
