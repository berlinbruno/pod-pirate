package dev.berlinbruno.PodPirateBackendApplication.exception;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import lombok.Getter;

@Getter
public class ForbiddenException extends RuntimeException {
    private final GeneralResponse errorResponse;

    public ForbiddenException(GeneralResponse errorResponse) {
        super(errorResponse.getMessage());
        this.errorResponse = errorResponse;
    }
}
