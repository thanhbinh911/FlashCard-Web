package hust.soict.ict.flashcard_web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;

public interface SessionFlashcardRepository extends JpaRepository<SessionFlashcardEntity, Long> {
    List<SessionFlashcardEntity> findBySession_Id(Long sessionId);
    
    
    Optional<SessionFlashcardEntity> findBySession_IdAndFlashcard_Id(Long sessionId, Long flashcardId);
}
