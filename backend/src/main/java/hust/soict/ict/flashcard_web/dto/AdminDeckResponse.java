package hust.soict.ict.flashcard_web.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Deck details for admin view.
 */
@AllArgsConstructor
@Getter
public class AdminDeckResponse {
    private Long id;
    private String title;
    private String description;
    private Long ownerId;
    private String ownerUsername;
    private Integer cardCount;
    private Boolean isPublic;
    private LocalDateTime createdAt;
}
