package dev.berlinbruno.PodPirateBackendApplication.service.impl;

import dev.berlinbruno.PodPirateBackendApplication.dto.GeneralResponse;
import dev.berlinbruno.PodPirateBackendApplication.exception.NotFoundException;
import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import dev.berlinbruno.PodPirateBackendApplication.model.Podcast;
import dev.berlinbruno.PodPirateBackendApplication.repository.AppUserRepository;
import dev.berlinbruno.PodPirateBackendApplication.repository.PodcastRepository;
import dev.berlinbruno.PodPirateBackendApplication.service.LookupService;
import dev.berlinbruno.PodPirateBackendApplication.types.AccountRoles;
import dev.berlinbruno.PodPirateBackendApplication.types.AppMessage;
import dev.berlinbruno.PodPirateBackendApplication.types.EpisodeStatus;
import dev.berlinbruno.PodPirateBackendApplication.types.PodcastStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class LookupServiceImpl implements LookupService {

    private final AppUserRepository appUserRepository;
    private final PodcastRepository podcastRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public Podcast getPodcastById(String podcastId) {
        return podcastRepository.findById(podcastId)
                .orElseThrow(() -> new NotFoundException(
                        new GeneralResponse(
                                HttpStatus.NOT_FOUND,
                                AppMessage.PODCAST_NOT_FOUND.getCode(),
                                AppMessage.PODCAST_NOT_FOUND.getMessage(),
                                AppMessage.PODCAST_NOT_FOUND.getDetail()
                        )
                ));
    }

    @Override
    public Podcast getPublishedPodcastById(String podcastId) {
        return podcastRepository.findByIdAndPodcastStatus(podcastId, PodcastStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException(
                        new GeneralResponse(
                                HttpStatus.NOT_FOUND,
                                AppMessage.PODCAST_NOT_FOUND.getCode(),
                                AppMessage.PODCAST_NOT_FOUND.getMessage(),
                                AppMessage.PODCAST_NOT_FOUND.getDetail()
                        )
                ));
    }


    @Override
    public AppUser getById(String userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(new GeneralResponse(
                        HttpStatus.NOT_FOUND,
                        AppMessage.USER_NOT_FOUND.getCode(),
                        AppMessage.USER_NOT_FOUND.getMessage(),
                        AppMessage.USER_NOT_FOUND.getDetail()
                )));
    }

    @Override
    public AppUser getByEmail(String email) {
        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException(new GeneralResponse(
                        HttpStatus.NOT_FOUND,
                        AppMessage.USER_NOT_FOUND.getCode(),
                        AppMessage.USER_NOT_FOUND.getMessage(),
                        AppMessage.USER_NOT_FOUND.getDetail()
                )));
    }

    public Page<Podcast> searchPodcasts(
            String userId,
            String category,
            Boolean flagged,
            PodcastStatus podcastStatus,
            EpisodeStatus episodeStatus,
            String keyword,
            Date publishedFrom,
            Date publishedTo,
            int page,
            int size
    ) {

        List<Criteria> criteriaList = new ArrayList<>();

        if (userId != null) {
            criteriaList.add(Criteria.where("userId").is(userId));
        }

        if (category != null) {
            criteriaList.add(Criteria.where("category").is(category));
        }

        if (flagged != null) {
            criteriaList.add(Criteria.where("flagged").is(flagged));
        }

        if (podcastStatus != null) {
            criteriaList.add(Criteria.where("podcastStatus").is(podcastStatus));
        }

        if (publishedFrom != null || publishedTo != null) {
            Criteria dateCriteria = Criteria.where("publishedAt");
            if (publishedFrom != null) dateCriteria.gte(publishedFrom);
            if (publishedTo != null) dateCriteria.lte(publishedTo);
            criteriaList.add(dateCriteria);
        }

        if (episodeStatus != null) {
            criteriaList.add(
                    Criteria.where("episodes")
                            .elemMatch(Criteria.where("episodeStatus").is(episodeStatus))
            );
        }

        if (keyword != null && !keyword.isBlank()) {
            criteriaList.add(
                    new Criteria().orOperator(
                            Criteria.where("title").regex(keyword, "i"),
                            Criteria.where("description").regex(keyword, "i"),
                            Criteria.where("episodes.title").regex(keyword, "i"),
                            Criteria.where("episodes.description").regex(keyword, "i")
                    )
            );
        }

        Criteria finalCriteria = new Criteria().andOperator(
                criteriaList.toArray(new Criteria[0])
        );

        Query query = new Query(finalCriteria)
                .with(PageRequest.of(
                        page,
                        size,
                        Sort.by(Sort.Direction.DESC, "publishedAt")
                ));

        List<Podcast> podcasts = mongoTemplate.find(query, Podcast.class);
        long count = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                Podcast.class
        );

        return new PageImpl<>(podcasts, PageRequest.of(page, size), count);
    }

    @Override
    public Page<AppUser> searchUsers(
            AccountRoles roles,
            Boolean isLocked,
            Boolean isEmailVerified,
            String keyword,
            Date joinedFrom,
            Date joinedTo,
            int page,
            int size
    ) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (roles != null) {
            criteriaList.add(Criteria.where("roles").is(roles));
        }

        if (isEmailVerified != null) {
            criteriaList.add(Criteria.where("isEmailVerified").is(isEmailVerified));
        }

        if (isLocked != null) {
            criteriaList.add(Criteria.where("isLocked").is(isLocked));
        }

        if (keyword != null && !keyword.isBlank()) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("username").regex(keyword, "i"),
                    Criteria.where("email").regex(keyword, "i"),
                    Criteria.where("bio").regex(keyword, "i")
            ));
        }

        if (joinedFrom != null || joinedTo != null) {
            Criteria dateCriteria = Criteria.where("createdAt");
            if (joinedFrom != null) dateCriteria.gte(joinedFrom);
            if (joinedTo != null) dateCriteria.lte(joinedTo);
            criteriaList.add(dateCriteria);
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(
                    new Criteria().andOperator(criteriaList.toArray(new Criteria[0]))
            );
        }

        query.with(PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        ));

        List<AppUser> appUsers = mongoTemplate.find(query, AppUser.class);

        long count = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                AppUser.class
        );

        return new PageImpl<>(appUsers, PageRequest.of(page, size), count);
    }

}

