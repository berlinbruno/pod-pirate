package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.exception.NotFoundException;
import dev.berlinbruno.PodPirateBackendApplication.service.CloudBlobService;
import dev.berlinbruno.PodPirateBackendApplication.types.AppMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AzureBlobServiceImpl implements CloudBlobService {

    private static final BlobSasPermission READ_PERMISSION = BlobSasPermission.parse("r");
    private static final BlobSasPermission WRITE_PERMISSION = BlobSasPermission.parse("w");

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    @Value("${azure.signed-url.expiry.read:1}") // Default 1 day
    private int readExpiryDays;

    @Value("${azure.signed-url.expiry.write:30}") // Default 30 minutes
    private int writeExpiryMinutes;

    private BlobServiceClient getBlobServiceClient() {
        verifyString(connectionString);
        return new BlobServiceClientBuilder().connectionString(connectionString).buildClient();
    }

    private BlobContainerClient getBlobContainerClient() {
        verifyString(containerName);
        return getBlobServiceClient().getBlobContainerClient(containerName);
    }

    @Override
    public String generateSignedUrlForUpload(String filePath) {
        verifyString(filePath);
        return generateSignedUrl(filePath, WRITE_PERMISSION, OffsetDateTime.now().plusMinutes(writeExpiryMinutes));
    }

    @Override
    public void verifyFileUpload(String filePath) {
        verifyString(filePath);

        BlobClient blobClient = getBlobContainerClient().getBlobClient(filePath);
        if (!blobClient.exists()) {
            throw new NotFoundException(
                    new GeneralResponse(
                            HttpStatus.NOT_FOUND,
                            AppMessage.FILE_UPLOAD_INCOMPLETE.getCode(),
                            AppMessage.FILE_UPLOAD_INCOMPLETE.getMessage(),
                            AppMessage.FILE_UPLOAD_INCOMPLETE.getDetail()
                    )
            );
        }
    }

    @Override
    public String generateSignedUrlForDownload(String filePath) {
        return generateSignedUrl(filePath, READ_PERMISSION, OffsetDateTime.now().plusDays(readExpiryDays));
    }

    @Override
    public void deleteFile(String filePath) {
        verifyString(filePath);
        BlobClient blobClient = getBlobContainerClient().getBlobClient(filePath);
        if (blobClient.exists()) {
            blobClient.delete();
        }
    }

    private String generateSignedUrl(String blobName, BlobSasPermission permission, OffsetDateTime expiryTime) {
        BlobClient blobClient = getBlobContainerClient().getBlobClient(blobName);
        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(expiryTime, permission);
        String sasToken = blobClient.generateSas(sasValues);

        return blobClient.getBlobUrl() + "?" + sasToken;
    }

    private void verifyString(String string) {
        if (string == null || string.isEmpty()) {
            throw new IllegalArgumentException("String must not be null or empty for deletion.");
        }
    }
}
