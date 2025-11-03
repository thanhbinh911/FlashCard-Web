package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class FlashcardTagId implements Serializable {
    private Long flashcardId;
    private Long tagId;

    public FlashcardTagId() {
    }

    public FlashcardTagId(Long flashcardId, Long tagId) {
        this.flashcardId = flashcardId;
        this.tagId = tagId;
    }

    public Long getFlashcardId() {
        return flashcardId;
    }

    public void setFlashcardId(Long flashcardId) {
        this.flashcardId = flashcardId;
    }

    public Long getTagId() {
        return tagId;
    }
    public void setTagId(Long tagId) {
        this.tagId = tagId;
    }

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
