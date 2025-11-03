package hust.soict.ict.flashcard_web.repository;

import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * This interface defines the repository for managing `FlashcardEntity` instances.
 * It extends `JpaRepository`, providing standard CRUD operations and custom query methods
 * for accessing flashcard data in the database.
 */
@Repository
public interface FlashcardRepository extends JpaRepository<FlashcardEntity, Long> {

    /**
     * Finds all flashcards belonging to a specific deck.
     *
     * @param deckId the unique identifier of the deck
     * @return a list of `FlashcardEntity` objects associated with the specified deck
     */
    List<FlashcardEntity> findByDeck_Id(Long deckId);
}