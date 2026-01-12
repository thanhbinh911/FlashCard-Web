package hust.soict.ict.flashcard_web.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Response for getting the user's active (in-progress) session.
 * Used for resume functionality.
 */
@AllArgsConstructor
@Getter
public class ActiveSessionResponse {
    private Long sessionId;
    private Long deckId;
    private String deckTitle;
    private LocalDateTime startedAt;
    private Long timeLimitSeconds;
    private String status;
    private Integer totalCards;
    private String sessionMode;
    private List<SessionFlashcardDto> flashcards;
}
