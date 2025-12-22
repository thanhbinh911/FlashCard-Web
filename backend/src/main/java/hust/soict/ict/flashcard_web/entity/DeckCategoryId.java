package hust.soict.ict.flashcard_web.entity;
import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable  // Indicate that this class can be embedded in an entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeckCategoryId implements Serializable {
    private Long deckId;
    private Long categoryId;


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
