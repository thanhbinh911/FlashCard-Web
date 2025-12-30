package hust.soict.ict.flashcard_web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hust.soict.ict.flashcard_web.entity.DeckCategoryEntity;
import hust.soict.ict.flashcard_web.entity.DeckCategoryId;

@Repository
public interface DeckCategoryRepository extends JpaRepository<DeckCategoryEntity, DeckCategoryId> {
    List<DeckCategoryEntity> findByDeck_Id(Long deckId);
}
