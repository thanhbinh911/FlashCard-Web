package hust.soict.ict.flashcard_web.repository;

import hust.soict.ict.flashcard_web.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * This interface defines the repository for managing `UserEntity` instances.
 * It extends `JpaRepository`, providing standard CRUD operations and custom query methods
 * for accessing user data in the database.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    /**
     * Finds a user by their email address.
     *
     * @param email the email address to search for
     * @return an `Optional` containing the `UserEntity` if found, or an empty `Optional` otherwise
     */
    Optional<UserEntity> findByEmail(String email);

    /**
     * Finds a user by their username.
     *
     * @param username the username to search for
     * @return an `Optional` containing the `UserEntity` if found, or an empty `Optional` otherwise
     */
    Optional<UserEntity> findByUsername(String username);

    /**
     * Checks if a user with the given username already exists.
     *
     * @param username the username to check
     * @return `true` if a user with the username exists, `false` otherwise
     */
    Boolean existsByUsername(String username);

    /**
     * Checks if a user with the given email address already exists.
     *
     * @param email the email address to check
     * @return `true` if a user with the email exists, `false` otherwise
     */
    Boolean existsByEmail(String email);
}