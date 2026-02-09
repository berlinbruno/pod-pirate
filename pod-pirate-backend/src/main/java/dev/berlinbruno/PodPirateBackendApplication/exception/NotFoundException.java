package dev.berlinbruno.PodPirateBackendApplication.exception;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import lombok.Getter;

@Getter
public class NotFoundException extends RuntimeException {
    private final GeneralResponse errorResponse;

    public NotFoundException(GeneralResponse errorResponse) {
        super(errorResponse.getMessage());
        this.errorResponse = errorResponse;
    }
}
