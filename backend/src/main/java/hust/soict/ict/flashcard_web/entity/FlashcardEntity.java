package hust.soict.ict.flashcard_web.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "flashcards")
public class FlashcardEntity {
    @Id
    @Column(name = "flashcard_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deck_id", referencedColumnName = "deck_id", nullable = false)
    private DeckEntity deck;

    @OneToMany (mappedBy = "flashcard", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionFlashcardEntity> sessionFlashcards = new ArrayList<>();

    @Column (name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column (name = "answer_text", columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Column(columnDefinition =  "TEXT")
    private String hint;

    /**
     * Cached AI-generated distractors for MCQ mode.
     * Stored as comma-separated values to avoid repeated AI calls.
     * Example: "London,Berlin,Madrid"
     */
    @Column(name = "distractors", columnDefinition = "TEXT")
    private String distractors;

}
