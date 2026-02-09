package dev.berlinbruno.PodPirateBackendApplication.exception;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import lombok.Getter;

@Getter
public class ConflictException extends RuntimeException {
    private final GeneralResponse errorResponse;

    public ConflictException(GeneralResponse errorResponse) {
        super(errorResponse.getMessage());
        this.errorResponse = errorResponse;
    }
}
