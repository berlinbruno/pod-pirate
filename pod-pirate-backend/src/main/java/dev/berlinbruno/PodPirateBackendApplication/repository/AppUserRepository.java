package dev.berlinbruno.PodPirateBackendApplication.repository;


import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByRoles(String admin);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
