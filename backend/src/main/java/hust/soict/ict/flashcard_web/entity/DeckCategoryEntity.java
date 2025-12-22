package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "deck_categories")
public class DeckCategoryEntity {

    @EmbeddedId
    @AttributeOverrides({
        @AttributeOverride(name = "deckId", column = @Column(name = "deck_id")),
        @AttributeOverride(name = "categoryId", column = @Column(name = "category_id"))
    })
    private DeckCategoryId id = new DeckCategoryId();

    @ManyToOne
    @MapsId("deckId")
    @JoinColumn(name = "deck_id")
    private DeckEntity deck;

    @ManyToOne
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    public DeckCategoryEntity(DeckEntity deck, CategoryEntity category) {
        this.deck = deck;
        this.category = category;
    }
}
