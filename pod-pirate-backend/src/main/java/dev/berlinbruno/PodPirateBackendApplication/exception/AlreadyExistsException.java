package dev.berlinbruno.PodPirateBackendApplication.exception;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import lombok.Getter;

@Getter
public class AlreadyExistsException extends RuntimeException {

    private final GeneralResponse errorResponse;

    public AlreadyExistsException(GeneralResponse errorResponse) {
        super(errorResponse.getMessage());
        this.errorResponse = errorResponse;
    }
}
