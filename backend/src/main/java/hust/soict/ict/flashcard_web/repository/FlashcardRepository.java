package hust.soict.ict.flashcard_web.repository;

import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<FlashcardEntity, Long> {

    List<FlashcardEntity> findByDeck_Id(Long deckId);
    long countByDeck_Id(Long deckId);
    
    /**
     * Batch count flashcards for multiple decks in a single query.
     * Returns list of [deckId, count] pairs.
     */
    @Query("SELECT f.deck.id, COUNT(f) FROM FlashcardEntity f WHERE f.deck.id IN :deckIds GROUP BY f.deck.id")
    List<Object[]> countByDeckIds(@Param("deckIds") List<Long> deckIds);
}