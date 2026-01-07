package hust.soict.ict.flashcard_web.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Request to create a new study session.
 */
@Getter
@Setter
public class CreateSessionRequest {
    private Long deckId;
    private Long timeLimitSeconds; // null for practice mode (no time limit)
    private Boolean isPracticeMode = false;
    
    /**
     * Session mode: "REGULAR", "MCQ", or "REVIEW"
     * - REGULAR: Fill-in-the-blank (default)
     * - MCQ: Multiple choice with AI-generated distractors
     * - REVIEW: Just view flashcards (no scoring)
     */
    private String sessionMode = "REGULAR";
}
