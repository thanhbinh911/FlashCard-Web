package hust.soict.ict.flashcard_web.service.sessionmode;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;

/**
 * Flashcard review mode - just show cards without answer tracking.
 * Useful for studying/memorizing without being tested.
 */
@Component
public class FlashcardReviewMode implements SessionMode {
    
    public static final String MODE_NAME = "REVIEW";
    
    @Override
    public String getModeName() {
        return MODE_NAME;
    }
    
    @Override
    public Object getQuestions(List<SessionFlashcardEntity> sessionFlashcards) {
        // Return flashcard DTOs including the answer (user can flip to see)
        return sessionFlashcards.stream()
                .map(this::toReviewDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean checkAnswer(SessionFlashcardEntity flashcard, String userAnswer) {
        // Review mode doesn't validate answers - always return true
        return true;
    }
    
    @Override
    public boolean tracksAnswers() {
        // Review mode doesn't track/score answers
        return false;
    }
    
    /**
     * DTO for review mode - includes the answer since user can reveal it.
     */
    private ReviewFlashcardDto toReviewDto(SessionFlashcardEntity entity) {
        FlashcardEntity flashcard = entity.getFlashcard();
        
        return new ReviewFlashcardDto(
                flashcard != null ? flashcard.getId() : null,
                entity.getPosition(),
                flashcard != null ? flashcard.getQuestion() : null,
                flashcard != null ? flashcard.getAnswer() : null,
                flashcard != null ? flashcard.getHint() : null
        );
    }
    
    /**
     * Inner DTO for review mode - includes answer for reveal functionality.
     */
    public record ReviewFlashcardDto(
            Long flashcardId,
            Integer position,
            String questionText,
            String answerText,  // Included for reveal
            String hint
    ) {}
}
