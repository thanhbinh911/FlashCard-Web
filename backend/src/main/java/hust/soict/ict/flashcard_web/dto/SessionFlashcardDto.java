package hust.soict.ict.flashcard_web.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * DTO representing a flashcard within a study session.
 * Used to return all flashcards when starting or resuming a session.
 * 
 * Note: This DTO only contains question data. Answer/result data is
 * returned separately via SessionSummaryResponse after the session ends.
 */
@Builder
@Getter
public class SessionFlashcardDto {
    /** ID of the original flashcard */
    private final Long flashcardId;
    
    /** Display order in the session (1-based) */
    private final Integer position;
    
    /** The question text to display */
    private final String questionText;
    
    /** Optional hint for the question */
    private final String hint;
}

