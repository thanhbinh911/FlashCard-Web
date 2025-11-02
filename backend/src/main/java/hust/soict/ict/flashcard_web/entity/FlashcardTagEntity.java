package hust.soict.ict.flashcard_web.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "flashcard_tags")
public class FlashcardTagEntity {
    @EmbeddedId
    @AttributeOverrides(
            {
             @AttributeOverride(name = "flashcardId", column = @Column(name = "flashcard_id")),
                    @AttributeOverride(name = "tagId", column = @Column(name = "tag_id"))
            }
    )
    private FlashcardTagId id = new FlashcardTagId();

    @ManyToOne
    @MapsId("flashcardId")
    @JoinColumn(name = "flashcard_id")
    private FlashcardEntity flashcard;

    @ManyToOne
    @MapsId("tagId")
    @JoinColumn(name = "tag_id")
    private TagEntity tag;

    public FlashcardTagEntity() {
    }

    public FlashcardTagEntity(FlashcardEntity flashcard, TagEntity tag) {
        this.flashcard = flashcard;
        this.tag = tag;
        Long flashcardId = (flashcard != null) ? flashcard.getId() : null;
        Long tagId = (tag != null) ? tag.getId() : null;
        this.id = new FlashcardTagId(flashcardId, tagId);
    }

    public FlashcardTagId getId() {
        return id;
    }
    public void setId(FlashcardTagId id) {
        this.id = id;
    }
    public FlashcardEntity getFlashcard() {
        return flashcard;
    }
    public void setFlashcard(FlashcardEntity flashcard) {
        this.flashcard = flashcard;
        if (flashcard != null) {
                        Long flashcardId = flashcard.getId();
            if (flashcardId != null) {
                this.id.setFlashcardId(flashcardId);
            }
        }
    }
    public TagEntity getTag() {
        return tag;
    }
    public void setTag(TagEntity tag) {
        this.tag = tag;
        if (tag != null) {
            Long tagId = tag.getId();
            if (tagId != null) {
                this.id.setTagId(tagId);
            }
        }
    }

}
