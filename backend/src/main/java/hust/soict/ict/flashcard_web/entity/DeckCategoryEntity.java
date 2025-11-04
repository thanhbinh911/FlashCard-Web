package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.*;


@Entity
@Table (name = "deck_categories")
public class DeckCategoryEntity {
    @EmbeddedId
    @AttributeOverrides(
            {
             @AttributeOverride(name = "deckId", column = @Column(name = "deck_id")),
                    @AttributeOverride(name = "categoryId", column = @Column(name = "category_id"))
            }
    )
    private DeckCategoryId id = new DeckCategoryId();

    @ManyToOne
    @MapsId("deckId")
    @JoinColumn(name = "deck_id")
    private DeckEntity deck;


    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    // Default Constructor
    public DeckCategoryEntity() {
    }

    public DeckCategoryEntity(DeckEntity deck, CategoryEntity category) {
        this.deck = deck;
        this.category = category;
                Long deckId = (deck != null) ? deck.getId() : null;
        Long categoryId = (category != null) ? category.getId() : null;
        this.id = new DeckCategoryId(deckId, categoryId);
    }

    public DeckCategoryId getId() {
        return id;
    }
    public void setId(DeckCategoryId id) {
        this.id = id;
    }
    public DeckEntity getDeck() {
        return deck;
    }
    public void setDeck(DeckEntity deck) {
        this.deck = deck;
        if (deck != null) {
            this.id.setDeckId(deck.getId());
        }
    }

    public CategoryEntity getCategory() {
        return category;
    }
    public void setCategory(CategoryEntity category) {
        this.category = category;
        if (category != null) {
            this.id.setCategoryId(category.getId());
        }
    }
}
