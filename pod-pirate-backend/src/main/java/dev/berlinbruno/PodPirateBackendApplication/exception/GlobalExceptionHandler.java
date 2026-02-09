package dev.berlinbruno.PodPirateBackendApplication.exception;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.types.AppMessage;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<GeneralResponse> handleAlreadyExistsException(AlreadyExistsException ex) {
        return buildErrorResponse(ex.getErrorResponse());
    }

    @ExceptionHandler(InvalidResourceException.class)
    public ResponseEntity<GeneralResponse> handleInvalidResourceException(InvalidResourceException ex) {
        return buildErrorResponse(ex.getErrorResponse());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<GeneralResponse> handleNotFoundException(NotFoundException ex) {
        return buildErrorResponse(ex.getErrorResponse());
    }

    @ExceptionHandler(ResourceUnavailableException.class)
    public ResponseEntity<GeneralResponse> handleResourceUnavailable(ResourceUnavailableException ex) {
        return buildErrorResponse(ex.getErrorResponse());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<GeneralResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return buildErrorResponse(ex.getErrorResponse());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<GeneralResponse> handleForbiddenException(ForbiddenException ex) {
        return buildErrorResponse(ex.getErrorResponse());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<GeneralResponse> handleConflictException(ConflictException ex) {
        return buildErrorResponse(ex.getErrorResponse());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<GeneralResponse> handleBadCredentialsException(BadCredentialsException ex) {
        GeneralResponse errorResponse = new GeneralResponse(
                HttpStatus.UNAUTHORIZED,
                AppMessage.INVALID_CREDENTIALS.getCode(),
                AppMessage.INVALID_CREDENTIALS.getMessage(),
                AppMessage.INVALID_CREDENTIALS.getDetail()
        );
        return buildErrorResponse(errorResponse);
    }


    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<GeneralResponse> handleExpiredJwtException(ExpiredJwtException ex) {
        GeneralResponse errorResponse = new GeneralResponse(
                HttpStatus.BAD_REQUEST,
                AppMessage.TOKEN_EXPIRED.getCode(),
                AppMessage.TOKEN_EXPIRED.getMessage(),
                AppMessage.TOKEN_EXPIRED.getDetail()
        );
        return buildErrorResponse(errorResponse);
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<GeneralResponse> handleMalformedJwtException(MalformedJwtException ex) {
        GeneralResponse errorResponse = new GeneralResponse(
                HttpStatus.BAD_REQUEST,
                AppMessage.TOKEN_INVALID.getCode(),
                AppMessage.TOKEN_INVALID.getMessage(),
                AppMessage.TOKEN_INVALID.getDetail()
        );
        return buildErrorResponse(errorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<GeneralResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        GeneralResponse errorResponse = new GeneralResponse(
                HttpStatus.BAD_REQUEST,
                AppMessage.INVALID_REQUEST.getCode(),
                AppMessage.INVALID_REQUEST.getMessage(),
                ex.getMessage()
        );
        return buildErrorResponse(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GeneralResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Invalid request");

        GeneralResponse errorResponse = new GeneralResponse(
                HttpStatus.BAD_REQUEST,
                AppMessage.INVALID_REQUEST.getCode(),
                errorMessage,
                null
        );

        return buildErrorResponse(errorResponse);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<GeneralResponse> handleGenericException(Exception ex) {
        GeneralResponse errorResponse = new GeneralResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                AppMessage.INTERNAL_SERVER_ERROR.getCode(),
                AppMessage.INTERNAL_SERVER_ERROR.getMessage(),
                ex.getMessage()
        );
        return buildErrorResponse(errorResponse);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<GeneralResponse> handleMissingServletRequestParameterException(MissingServletRequestParameterException ex) {
        GeneralResponse errorResponse = new GeneralResponse(
                HttpStatus.BAD_REQUEST,
                AppMessage.MISSING_REQUEST_PARAMETER.getCode(),
                AppMessage.MISSING_REQUEST_PARAMETER.getMessage(),
                ex.getMessage()
        );
        return buildErrorResponse(errorResponse);
    }

    private ResponseEntity<GeneralResponse> buildErrorResponse(GeneralResponse errorResponse) {
        return ResponseEntity
                .status(errorResponse.getHttpStatus())
                .body(
                        new GeneralResponse(
                                errorResponse.getHttpStatus(),
                                errorResponse.getCode(),
                                errorResponse.getMessage(),
                                errorResponse.getDetails()
                        )
                );
    }
}
