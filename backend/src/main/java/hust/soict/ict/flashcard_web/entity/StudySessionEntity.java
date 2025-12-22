package hust.soict.ict.flashcard_web.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "study_sessions")
public class StudySessionEntity {

    public enum SessionStatus {
        IN_PROGRESS,
        COMPLETED,
        ABANDONED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "deck_id", nullable = false)
    private DeckEntity deck;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionFlashcardEntity> sessionFlashcards = new ArrayList<>();

    @Setter(AccessLevel.NONE)
    @Column(name = "start_time", nullable = false, updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime startedAt;

    @Column(name = "end_time")
    private LocalDateTime endedAt;

    @Column(name = "total_cards")
    private Integer totalCards;

    @Column(name = "time_limit_seconds")
    private Long timeLimitSeconds;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SessionStatus status = SessionStatus.IN_PROGRESS;

    @Column(name = "correct_answers_count")
    private Integer correctAnswersCount = 0;

    @Column(name = "is_practice_mode", nullable = false)
    private Boolean isPracticeMode = false;

    /**
     * Session mode: "REGULAR", "MCQ", or "REVIEW"
     * Uses Strategy Pattern for different study modes.
     */
    @Column(name = "session_mode", nullable = false)
    private String sessionMode = "REGULAR";

}
