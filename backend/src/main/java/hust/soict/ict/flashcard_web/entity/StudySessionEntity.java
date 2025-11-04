package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "study_sessions")
public class StudySessionEntity {
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
    private List<SessionFlashcardEntity> sessionFlashcards;


    @Column(name = "start_time", nullable = false, updatable = false, insertable = false)
    private LocalDateTime startedAt;

    @Column(name = "end_time")
    private LocalDateTime endedAt;
    public StudySessionEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
    public DeckEntity getDeck() {
        return deck;
    }
    public void setDeck(DeckEntity deck) {
        this.deck = deck;
    }
    public LocalDateTime getStartedAt() {
        return startedAt;
    }
    public LocalDateTime getEndedAt() {
        return endedAt;
    }
    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }
}
