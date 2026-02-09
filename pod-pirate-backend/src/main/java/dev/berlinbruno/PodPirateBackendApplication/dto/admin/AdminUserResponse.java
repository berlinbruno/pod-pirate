package dev.berlinbruno.PodPirateBackendApplication.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private String userId;
    private String username;
    private String email;
    private String profileUrl;
    private boolean isLocked;
    private boolean isEmailVerified;
    private Set<String> roles;
    private long podcastCount;
    private Date createdDate;
    private Date lastLoginDate;
}

