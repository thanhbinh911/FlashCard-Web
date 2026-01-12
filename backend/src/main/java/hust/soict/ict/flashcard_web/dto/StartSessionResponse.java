package hust.soict.ict.flashcard_web.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Response for starting or resuming a session.
 * Contains session info and mode-specific questions.
 */
@AllArgsConstructor
@Getter
public class StartSessionResponse {
    private Long sessionId;
    private LocalDateTime startedAt;
    private Long timeLimitSeconds;
    private String status;
    private String sessionMode;  // "REGULAR", "MCQ", or "REVIEW"
    private Object questions;    // Type depends on mode (List<SessionFlashcardDto>, List<MCQ>, etc.)
}