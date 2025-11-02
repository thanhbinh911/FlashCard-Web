package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.*;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "decks")
public class DeckEntity {

    @Id
    @Column(name = "deck_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FlashcardEntity> flashcards;

    @ManyToOne
    @JoinColumn(name = "user_id",  nullable = false)
    private UserEntity user;

    @Column(name = "title", columnDefinition = "TEXT", nullable = false)
    private String title;


    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public DeckEntity() {}


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

    public String getTitle() {
        return title;
    }

    public void setTitle(String tile) {
        this.title = title;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public List<FlashcardEntity> getFlashcards () {
        return flashcards;
    }
    public void setFlashcards (List<FlashcardEntity> flashcards) {
        this.flashcards = flashcards;
    }

}
