package hust.soict.ict.flashcard_web.service.sessionmode;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hust.soict.ict.flashcard_web.dto.SessionFlashcardDto;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;

/**
 * Regular fill-in-the-blank session mode.
 * User sees question and types their answer.
 */
@Component
public class RegularSessionMode implements SessionMode {
    
    public static final String MODE_NAME = "REGULAR";
    
    @Override
    public String getModeName() {
        return MODE_NAME;
    }
    
    @Override
    public Object getQuestions(List<SessionFlashcardEntity> sessionFlashcards) {
        // Return simple flashcard DTOs (question + hint, no answer shown)
        return sessionFlashcards.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean checkAnswer(SessionFlashcardEntity flashcard, String userAnswer) {
        FlashcardEntity fc = flashcard.getFlashcard();
        if (fc == null) return false;
        
        String correct = normalize(fc.getAnswer());
        String user = normalize(userAnswer);
        
        return correct.equals(user);
    }
    
    private SessionFlashcardDto toDto(SessionFlashcardEntity entity) {
        FlashcardEntity flashcard = entity.getFlashcard();
        
        return SessionFlashcardDto.builder()
                .flashcardId(flashcard != null ? flashcard.getId() : null)
                .position(entity.getPosition())
                .questionText(flashcard != null ? flashcard.getQuestion() : null)
                .hint(flashcard != null ? flashcard.getHint() : null)
                .build();
    }
    
    private String normalize(String s) {
        return s == null ? "" : s.trim().replaceAll("\\s+", " ").toLowerCase();
    }
}
