package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable // Indicate that this class can be embedded in an entity
public class DeckCategoryId implements Serializable {
    private Long deckId;
    private Long categoryId;

    public DeckCategoryId() {
    }

    public DeckCategoryId(Long deckId, Long categoryId) {
        this.deckId = deckId;
        this.categoryId = categoryId;
    }

    public Long getDeckId() {
        return deckId;
    }

    public void setDeckId(Long deckId) {
        this.deckId = deckId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || this.getClass() != o.getClass())
            return false;
        DeckCategoryId that = (DeckCategoryId) o;
        return Objects.equals(deckId, that.deckId) && Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deckId, categoryId);
    }
}
