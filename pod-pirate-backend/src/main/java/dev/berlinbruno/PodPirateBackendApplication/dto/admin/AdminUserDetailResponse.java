package dev.berlinbruno.PodPirateBackendApplication.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDetailResponse {
    private String userId;
    private String username;
    private String bio;
    private String email;
    private String profileUrl;
    private boolean isLocked;
    private boolean isEmailVerified;
    private Set<String> roles;
    private long podcastCount;
    private long totalEpisodeCount;
    private Date createdDate;
    private Date updatedDate;
    private Date lastLoginDate;
    private List<PodcastSummary> recentPodcasts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PodcastSummary {
        private String podcastId;
        private String title;
        private long episodeCount;
        private Date createdDate;
    }
}

