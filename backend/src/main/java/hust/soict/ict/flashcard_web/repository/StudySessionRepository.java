package hust.soict.ict.flashcard_web.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
     * Find all in-progress test sessions for a user (REGULAR or MCQ mode, not REVIEW).
     * These are the sessions that can be resumed.
     */
    @Query(value = "SELECT * FROM study_sessions s WHERE s.user_id = :userId AND s.status = :#{#status.name()} AND s.session_mode != 'REVIEW'", nativeQuery = true)
    List<StudySessionEntity> findUnfinishedTestSessions(
        @Param("userId") Long userId, 
        @Param("status") StudySessionEntity.SessionStatus status
    );

    /**
     * Count all study sessions (for admin dashboard).
     */
    @Override
    long count();

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE StudySessionEntity s SET s.status = :status, s.endedAt = :endedAt WHERE s.id = :sessionId")
    void updateStatus(@Param("sessionId") Long sessionId, @Param("status") StudySessionEntity.SessionStatus status, @Param("endedAt") java.time.LocalDateTime endedAt);
}
