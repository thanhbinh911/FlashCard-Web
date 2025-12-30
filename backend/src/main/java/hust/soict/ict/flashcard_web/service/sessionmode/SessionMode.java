package hust.soict.ict.flashcard_web.service.sessionmode;

import java.util.List;

import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;

/**
 * Strategy interface for different session modes.
 * Each mode defines how flashcards are presented and how answers are validated.
 * 
 * Implementations:
 * - RegularSessionMode: Fill-in-the-blank (user types answer)
 * - McqSessionMode: Multiple choice (AI generates distractors)
 * - FlashcardReviewMode: Just show cards (no answer checking)
 */
public interface SessionMode {
    
    /**
     * Get the mode name/type identifier.
     */
    String getModeName();
    
    /**
     * Transform flashcards for this mode's presentation format.
     * Each mode may return different data structures.
     * 
     * @param sessionFlashcards Raw session flashcards
     * @return Transformed data (could be DTOs, MCQs, etc.)
     */
    Object getQuestions(List<SessionFlashcardEntity> sessionFlashcards);
    
    /**
     * Check if the given answer is correct for a flashcard.
     * 
     * @param flashcard The session flashcard being answered
     * @param userAnswer The user's submitted answer
     * @return true if correct, false otherwise
     */
    boolean checkAnswer(SessionFlashcardEntity flashcard, String userAnswer);
    
    /**
     * Whether this mode tracks/validates answers.
     * Review mode returns false (just viewing).
     */
    default boolean tracksAnswers() {
        return true;
    }
}
