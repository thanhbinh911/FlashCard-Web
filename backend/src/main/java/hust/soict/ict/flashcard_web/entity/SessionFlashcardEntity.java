package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "session_flashcards")
public class SessionFlashcardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_flashcard_id")
    private Long id;


    @ManyToOne
    @JoinColumn(name = "session_id")
    private StudySessionEntity session;

    @ManyToOne
    @JoinColumn(name = "flashcard_id")
    private FlashcardEntity flashcard;

    public SessionFlashcardEntity() {
    }

//    public SessionFlashcardEntity(StudySessionEntity session, FlashcardEntity flashcard) {
//        this.session = session;
//        this.flashcard = flashcard;
//    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public StudySessionEntity getSession() {
        return session;
    }
    public void setSession(StudySessionEntity session) {
        this.session = session;
    };

    public FlashcardEntity getFlashcard() {
        return flashcard;
    }

    public void setFlashcard(FlashcardEntity flashcard) {
        this.flashcard = flashcard;
    }
}
