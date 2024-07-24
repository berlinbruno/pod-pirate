package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import dev.berlinbruno.PodPirateBackendApplication.service.AzureBlobService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AzureBlobServiceImpl implements AzureBlobService {

    private static final Logger logger = LoggerFactory.getLogger(AzureBlobServiceImpl.class);

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    private BlobServiceClient getBlobServiceClient() {
        if (connectionString == null || connectionString.isEmpty()) {
            logger.error("Connection string is null or empty");
            throw new IllegalArgumentException("Connection string must not be null or empty");
        }
        return new BlobServiceClientBuilder().connectionString(connectionString).buildClient();
    }

    private BlobContainerClient getBlobContainerClient() {
        if (containerName == null || containerName.isEmpty()) {
            logger.error("Container name is null or empty");
            throw new IllegalArgumentException("Container name must not be null or empty");
        }
        return getBlobServiceClient().getBlobContainerClient(containerName);
    }

    @Override
    public String saveFileToAzureBlob(String userId, String type, MultipartFile file) throws IOException {
        try {
            String blobName = generateBlobName(userId, type, file.getOriginalFilename());
            BlobClient blobClient = getBlobContainerClient().getBlobClient(blobName);
            logger.info("Uploading file to blob: {}", blobName);
            blobClient.upload(file.getInputStream(), file.getSize(), true);
            logger.info("File uploaded successfully: {}", blobName);
            return blobName;
        } catch (IOException e) {
            logger.error("Failed to save file to Azure Blob Storage", e);
            throw new RuntimeException("Failed to save file to Azure Blob Storage", e);
        }
    }

    @Override
    public InputStream downloadFromAzureBlob(String filePath) throws IOException {
        try {
            BlobClient blobClient = getBlobContainerClient().getBlobClient(filePath);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            logger.info("Downloading file from blob: {}", filePath);
            blobClient.download(outputStream);
            logger.info("File downloaded successfully: {}", filePath);
            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (Exception e) {
            logger.error("Failed to download file from Azure Blob Storage", e);
            throw new IOException("Failed to download file from Azure Blob Storage", e);
        }
    }

    @Override
    public String updateFileInAzureBlob(String filePath, MultipartFile file) throws IOException {
        try {
            BlobClient blobClient = getBlobContainerClient().getBlobClient(filePath);
            logger.info("Updating file in blob: {}", filePath);
            blobClient.upload(file.getInputStream(), file.getSize(), true);
            logger.info("File updated successfully: {}", filePath);
            return filePath;
        } catch (IOException e) {
            logger.error("Failed to update file in Azure Blob Storage", e);
            throw new RuntimeException("Failed to update file in Azure Blob Storage", e);
        }
    }

    @Override
    public void deleteFileFromAzureBlob(String filePath) throws IOException {
        try {
            BlobClient blobClient = getBlobContainerClient().getBlobClient(filePath);
            logger.info("Deleting file from blob: {}", filePath);
            blobClient.delete();
            logger.info("File deleted successfully: {}", filePath);
        } catch (Exception e) {
            logger.error("Failed to delete file from Azure Blob Storage", e);
            throw new IOException("Failed to delete file from Azure Blob Storage", e);
        }
    }

    @Override
    public String generateSignedUrlForDownload(String filePath) {
        BlobClient blobClient = getBlobContainerClient().getBlobClient(filePath);
        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(
                OffsetDateTime.now().plusDays(1), BlobSasPermission.parse("r"));
        String sasToken = blobClient.generateSas(sasValues);
        String signedUrl = blobClient.getBlobUrl() + "?" + sasToken;
        logger.info("Generated signed URL for download: {}", signedUrl);
        return signedUrl;
    }

    @Override
    public String generateSignedUrlForUpload(String userId, String type, String fileName) {
        String blobName = generateBlobName(userId, type, fileName);
        BlobClient blobClient = getBlobContainerClient().getBlobClient(blobName);
        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(
                OffsetDateTime.now().plusMinutes(30), BlobSasPermission.parse("w"));
        String sasToken = blobClient.generateSas(sasValues);
        String signedUrl = blobClient.getBlobUrl() + "?" + sasToken;
        logger.info("Generated signed URL for upload: {}", signedUrl);
        return signedUrl;
    }

    @Override
    public String generateSignedUrlForUpdate(String filePath) {
        BlobClient blobClient = getBlobContainerClient().getBlobClient(filePath);
        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(
                OffsetDateTime.now().plusMinutes(30), BlobSasPermission.parse("w"));
        String sasToken = blobClient.generateSas(sasValues);
        String signedUrl = blobClient.getBlobUrl() + "?" + sasToken;
        logger.info("Generated signed URL for update: {}", signedUrl);
        return signedUrl;
    }

    @Override
    public String generateUniqueImageName() {
        String uniqueImageName = UUID.randomUUID().toString();
        logger.info("Generated unique image name: {}", uniqueImageName);
        return uniqueImageName;
    }

    private String generateBlobName(String userId, String type, String originalFileName) {
        String blobName = userId + "/" + type + "/" + originalFileName;
        logger.info("Generated blob name: {}", blobName);
        return blobName;
    }
}
