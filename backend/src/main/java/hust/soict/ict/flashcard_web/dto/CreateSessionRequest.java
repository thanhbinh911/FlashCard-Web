package hust.soict.ict.flashcard_web.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Request to create a new study session.
 * 
 * Session modes:
 * - "REGULAR" or "MCQ": Test mode - saved to DB, timed, resumable
 * - "REVIEW": Review mode - ephemeral, not saved to DB
 */
@Getter
@Setter
public class CreateSessionRequest {
    private Long deckId;
    
    /**
     * Time limit in seconds. Required for test modes (REGULAR, MCQ).
     */
    private Long timeLimitSeconds;
    
    /**
     * Session mode: "REGULAR", "MCQ", or "REVIEW"
     * - REGULAR: Fill-in-the-blank (default)
     * - MCQ: Multiple choice with AI-generated distractors
     * - REVIEW: Just view flashcards (no scoring, no DB storage)
     */
    private String sessionMode = "REGULAR";
}
