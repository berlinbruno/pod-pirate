package dev.berlinbruno.PodPirateBackendApplication.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public interface AzureBlobService {

    String saveFileToAzureBlob(String userId, String type, MultipartFile file) throws IOException;

    InputStream downloadFromAzureBlob(String filePath) throws IOException;

    String updateFileInAzureBlob(String filePath, MultipartFile file) throws IOException;

    void deleteFileFromAzureBlob(String filePath) throws IOException;

    String generateSignedUrlForUpload(String userId, String type, String fileName) throws IOException;

    String generateSignedUrlForUpdate(String filePath) throws IOException;

    String generateSignedUrlForDownload(String filePath) throws IOException;

    String generateUniqueImageName();

}
