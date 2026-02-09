package dev.berlinbruno.PodPirateBackendApplication.dto.appuser;

import lombok.Data;

@Data
public class RemoveUserRequest {
    boolean bio;
    boolean profileUrl;
}
