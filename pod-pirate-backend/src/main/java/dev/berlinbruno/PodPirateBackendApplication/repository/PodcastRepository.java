package dev.berlinbruno.PodPirateBackendApplication.repository;

import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PodcastRepository extends MongoRepository<Podcast, String> {

    Optional<Podcast> findByIdAndPodcastStatus(String podcastId, PodcastStatus podcastStatus);

    List<Podcast> findAllByUserId(String userId);

    long countByUserId(String userId);

    long countByUserIdAndPodcastStatus(String userId, PodcastStatus podcastStatus);
}
