package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
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

    @Column(name = "position", nullable = false)
    private Integer position = 1;

    @Column(name = "user_answer", columnDefinition = "TEXT")
    private String userAnswer;

    @Column(name = "correct", nullable = false)
    private Boolean correct = false;
}
