package dev.berlinbruno.PodPirateBackendApplication.dto.creator;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorPublicResponse {
    private String creatorId;
    private String creatorName;
    private String bio;
    private String profileUrl;
    private long podcastCount;
    private Date joinedDate;
}

