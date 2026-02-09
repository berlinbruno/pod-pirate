package dev.berlinbruno.PodPirateBackendApplication.exception;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import lombok.Getter;

@Getter
public class ResourceUnavailableException extends RuntimeException {
    private final GeneralResponse errorResponse;

    public ResourceUnavailableException(GeneralResponse errorResponse) {
        super(errorResponse.getMessage());
        this.errorResponse = errorResponse;
    }
}
