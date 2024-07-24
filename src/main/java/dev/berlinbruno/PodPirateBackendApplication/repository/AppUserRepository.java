package dev.berlinbruno.PodPirateBackendApplication.repository;


import dev.berlinbruno.PodPirateBackendApplication.model.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AppUserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByRole(String admin);

    List<AppUser> findByLocked(boolean b);
}
