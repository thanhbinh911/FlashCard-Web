package hust.soict.ict.flashcard_web.repository;

import hust.soict.ict.flashcard_web.entity.DeckEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * This interface defines the repository for managing `DeckEntity` instances.
 * It extends `JpaRepository`, providing standard CRUD (Create, Read, Update, Delete) operations
 * and custom query methods for accessing deck data in the database.
 */
@Repository
public interface DeckRepository extends JpaRepository<DeckEntity, Long> {

    /**
     * Finds all decks belonging to a specific user.
     *
     * @param userId the unique identifier of the user
     * @return a list of `DeckEntity` objects owned by the specified user
     */
    List<DeckEntity> findByUser_Id(Long userId);
}