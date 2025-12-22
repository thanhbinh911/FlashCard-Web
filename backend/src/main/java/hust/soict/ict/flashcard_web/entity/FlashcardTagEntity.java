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
@Table(name = "flashcard_tags")
public class FlashcardTagEntity {

    @EmbeddedId
    @AttributeOverrides({
        @AttributeOverride(name = "flashcardId", column = @Column(name = "flashcard_id")),
        @AttributeOverride(name = "tagId", column = @Column(name = "tag_id"))
    })
    private FlashcardTagId id = new FlashcardTagId();

    @ManyToOne
    @MapsId("flashcardId")
    @JoinColumn(name = "flashcard_id")
    private FlashcardEntity flashcard;

    @ManyToOne
    @MapsId("tagId")
    @JoinColumn(name = "tag_id")
    private TagEntity tag;

    public FlashcardTagEntity(FlashcardEntity flashcard, TagEntity tag) {
        this.flashcard = flashcard;
        this.tag = tag;
    }
}
