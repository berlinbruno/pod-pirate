package dev.berlinbruno.PodPirateBackendApplication.service;

import dev.berlinbruno.PodPirateBackendApplication.types.VerificationType;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface EmailService {
    void sendEmailWithRetry(String to, String token, VerificationType type);

    void sendTokenByEmail(String to, String token, VerificationType type) throws MessagingException, UnsupportedEncodingException;
}
