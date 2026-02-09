package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.properties.FrontendProperties;
import dev.berlinbruno.PodPirateBackendApplication.service.EmailService;
import dev.berlinbruno.PodPirateBackendApplication.types.VerificationType;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final FrontendProperties frontend;
    private final String fromEmail;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            FrontendProperties frontend,
            @org.springframework.beans.factory.annotation.Value("${spring.mail.username}") String fromEmail
    ) {
        this.mailSender = mailSender;
        this.frontend = frontend;
        this.fromEmail = fromEmail;
    }

    private String getEmailVerificationHtml(String jwtToken) {
        String verificationLink = frontend.baseUrl() + frontend.emailVerificationPath() + jwtToken;

        return "<html>"
                + "<body>"
                + "<p>Dear User,</p>"
                + "<p>Please click the following link to verify your email address:</p>"
                + "<p><a href='" + verificationLink + "'>Verify Email</a></p>"
                + "<p>The verification link is valid for the next <strong>10 minutes</strong>.</p>"
                + "<p style='color:gray; font-size:12px;'>"
                + "(This is an auto-generated email. Please contact us at "
                + "<a href='mailto:berlinbruno12@gmail.com'>berlinbruno12@gmail.com</a> if you need assistance.)</p>"
                + "<p>Regards,<br/>Pod Pirate Team</p>"
                + "</body>"
                + "</html>";
    }

    private String getPasswordResetHtml(String jwtToken) {
        String resetLink = frontend.baseUrl() + frontend.passwordResetPath() + jwtToken;

        return "<html>"
                + "<body>"
                + "<p>Dear User,</p>"
                + "<p>Please click the following link to reset your password:</p>"
                + "<p><a href='" + resetLink + "'>Reset Password</a></p>"
                + "<p>The reset link is valid for the next <strong>10 minutes</strong>.</p>"
                + "<p style='color:gray; font-size:12px;'>"
                + "(This is an auto-generated email. Please contact us at "
                + "<a href='mailto:berlinbruno12@gmail.com'>berlinbruno12@gmail.com</a> if you need assistance.)</p>"
                + "<p>Regards,<br/>Pod Pirate Team</p>"
                + "</body>"
                + "</html>";
    }

    private String getAccountDeletionHtml(String jwtToken) {
        String resetLink = frontend.baseUrl() + frontend.accountDeletedPath() + jwtToken;

        return "<html>"
                + "<body>"
                + "<p>Dear User,</p>"
                + "<p>Please click the following link to confirm your account deletion:</p>"
                + "<p><a href='" + resetLink + "'>Delete Account</a></p>"
                + "<p>The deletion link is valid for the next <strong>10 minutes</strong>.</p>"
                + "<p style='color:gray; font-size:12px;'>"
                + "(This is an auto-generated email. Please contact us at "
                + "<a href='mailto:berlinbruno12@gmail.com'>berlinbruno12@gmail.com</a> if you need assistance.)</p>"
                + "<p>Regards,<br/>Pod Pirate Team</p>"
                + "</body>"
                + "</html>";
    }

    @Async
    @Retryable(
            retryFor = MessagingException.class,
            maxAttempts = 4,
            backoff = @Backoff(delay = 3000)
    )
    public void sendEmailWithRetry(String to, String jwtToken, VerificationType type) {
        try {
            sendTokenByEmail(to, jwtToken, type);
            CompletableFuture.completedFuture(1);
        } catch (MessagingException e) {
            CompletableFuture.completedFuture(handleMessagingException(e));
        } catch (UnsupportedEncodingException e) {
            CompletableFuture.completedFuture(handleUnsupportedEncodingException(e));
        }
    }

    @Recover
    public int handleMessagingException(MessagingException e) {
        log.error("Maximum attempt reached, failed to send email");
        log.error("Error message: {}", e.getMessage());
        return -1;
    }

    @Recover
    public int handleUnsupportedEncodingException(UnsupportedEncodingException e) {
        log.error("Maximum attempt reached , failed to send email");
        log.error("Error message : {}", e.getMessage());
        return -1;
    }

    public void sendTokenByEmail(String to, String jwtToken, VerificationType type) throws MessagingException, UnsupportedEncodingException {
        log.info("Trying to send email to {}", to);

        String senderName = "Pod Pirate";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail, senderName);
        helper.setTo(to);

        String subject;
        String htmlContent;

        switch (type) {
            case EMAIL -> {
                subject = "Verification Token to Verify Your Email Address";
                htmlContent = getEmailVerificationHtml(jwtToken);
            }
            case PASSWORD_RESET -> {
                subject = "Password Reset Token";
                htmlContent = getPasswordResetHtml(jwtToken);
            }
            case DELETION -> {
                subject = "Deletion Token";
                htmlContent = getAccountDeletionHtml(jwtToken);
            }
            default -> throw new IllegalArgumentException("Unsupported verification type: " + type);
        }

        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
        log.info("Email has been sent successfully to {}", to);
    }

}
