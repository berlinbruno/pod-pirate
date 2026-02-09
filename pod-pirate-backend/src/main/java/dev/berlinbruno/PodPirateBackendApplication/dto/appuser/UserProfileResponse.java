package dev.berlinbruno.PodPirateBackendApplication.dto.appuser;

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
public class UserProfileResponse {
    private String userId;
    private String email;
    private String username;
    private String bio;
    private String profileUrl;
    private long podcastCount;
    private Date joinedDate;
    private Date lastLoginDate;
    private Date updatedDate;
    private Set<String> roles;
}

