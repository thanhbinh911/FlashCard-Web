package hust.soict.ict.flashcard_web.entity;


import jakarta.persistence.*;

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

    @Column (name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column (name = "answer_text", columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Column(columnDefinition =  "TEXT")
    private String hint;



    public FlashcardEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public DeckEntity getDeck() {
        return deck;
    }
    public void setDeck(DeckEntity deck) {
        this.deck = deck;
    }

    public Long getDeckId() {
        return deck !=  null ? deck.getId() : null;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }
}
