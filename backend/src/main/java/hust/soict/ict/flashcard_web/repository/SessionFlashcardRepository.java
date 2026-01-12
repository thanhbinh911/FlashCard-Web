package hust.soict.ict.flashcard_web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;

public interface SessionFlashcardRepository extends JpaRepository<SessionFlashcardEntity, Long> {
    List<SessionFlashcardEntity> findBySession_Id(Long sessionId);
    
    
    Optional<SessionFlashcardEntity> findBySession_IdAndFlashcard_Id(Long sessionId, Long flashcardId);

    @org.springframework.data.jpa.repository.Query("SELECT sf FROM SessionFlashcardEntity sf LEFT JOIN FETCH sf.flashcard WHERE sf.session.id = :sessionId")
    List<SessionFlashcardEntity> findAllBySessionIdWithFlashcard(@org.springframework.data.repository.query.Param("sessionId") Long sessionId);
}
