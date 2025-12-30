package hust.soict.ict.flashcard_web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hust.soict.ict.flashcard_web.entity.StudySessionEntity;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySessionEntity, Long> {
    
    /**
     * Find in-progress sessions that have a time limit (for cleanup).
     */
    List<StudySessionEntity> findByStatusAndTimeLimitSecondsIsNotNull(StudySessionEntity.SessionStatus status);

    /**
     * Find an in-progress session for a specific user and deck.
     */
    Optional<StudySessionEntity> findByUser_IdAndDeck_IdAndStatus(Long userId, Long deckId, StudySessionEntity.SessionStatus status);

    /**
     * Find the first in-progress session for a user (for resume).
     */
    Optional<StudySessionEntity> findFirstByUser_IdAndStatus(Long userId, StudySessionEntity.SessionStatus status);

    /**
     * Find all sessions for a user.
     */
    List<StudySessionEntity> findByUser_Id(Long userId);

    /**
     * Count all study sessions (for admin dashboard).
     */
    @Override
    long count();
}
