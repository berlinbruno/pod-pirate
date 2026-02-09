package dev.berlinbruno.PodPirateBackendApplication.model;

import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Builder
@Document
public class Podcast {

    @Id
    private String id;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date lastModifiedAt;

    @NotBlank(message = "UserId should not be empty")
    private String userId;

    @Size(max = 500, message = "Podcast URL length should not exceed 500 characters")
    private String coverUrl;

    @Size(max = 500, message = "Banner URL length should not exceed 500 characters")
    private String bannerUrl;

    @NotBlank(message = "Category should not be empty")
    private String category;

    @NotBlank(message = "Title should not be empty")
    @Size(min = 3, max = 100, message = "Title should be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description should not be empty")
    @Size(min = 10, max = 300, message = "Description should be between 10 and 300 characters")
    private String description;

    private List<@Valid Episode> episodes;

    private boolean flagged;

    private PodcastStatus podcastStatus;

    private Date publishedAt;
}
