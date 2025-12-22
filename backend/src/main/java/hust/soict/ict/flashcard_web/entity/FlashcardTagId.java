package hust.soict.ict.flashcard_web.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardTagId implements Serializable {
    private Long flashcardId;
    private Long tagId;


    @Override
    public boolean equals(Object o) {
        if(this == o)
            return true;
        if (o == null || this.getClass() != o.getClass())
            return false;
        FlashcardTagId that = (FlashcardTagId) o;
        return Objects.equals(flashcardId, that.flashcardId) && Objects.equals(tagId, that.tagId);
    }
    @Override
    public int hashCode() {
        return Objects.hash(flashcardId, tagId);
    }
}
