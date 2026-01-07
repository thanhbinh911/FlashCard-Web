package hust.soict.ict.flashcard_web.service.sessionmode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hust.soict.ict.flashcard_web.dto.MultipleChoiceQuestion;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;
import hust.soict.ict.flashcard_web.repository.FlashcardRepository;
import hust.soict.ict.flashcard_web.service.DistractorService;

/**
 * Multiple Choice Question session mode.
 * Uses AI to generate distractors, caches them in the database.
 */
@Component
public class McqSessionMode implements SessionMode {
    
    public static final String MODE_NAME = "MCQ";
    private static final int DEFAULT_DISTRACTOR_COUNT = 3;
    
    private final DistractorService distractorService;
    private final FlashcardRepository flashcardRepository;
    
    public McqSessionMode(DistractorService distractorService, FlashcardRepository flashcardRepository) {
        this.distractorService = distractorService;
        this.flashcardRepository = flashcardRepository;
    }
    
    @Override
    public String getModeName() {
        return MODE_NAME;
    }
    
    @Override
    public Object getQuestions(List<SessionFlashcardEntity> sessionFlashcards) {
        // Return MCQ-formatted questions with shuffled options
        return sessionFlashcards.stream()
                .map(this::toMultipleChoice)
                .filter(mcq -> mcq != null)
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean checkAnswer(SessionFlashcardEntity flashcard, String userAnswer) {
        FlashcardEntity fc = flashcard.getFlashcard();
        if (fc == null) return false;
        
        // For MCQ, the userAnswer is the selected option text
        String correct = normalize(fc.getAnswer());
        String user = normalize(userAnswer);
        
        return correct.equals(user);
    }
    
    private MultipleChoiceQuestion toMultipleChoice(SessionFlashcardEntity sessionFlashcard) {
        FlashcardEntity flashcard = sessionFlashcard.getFlashcard();
        if (flashcard == null) {
            return null;
        }
        
        String correctAnswer = flashcard.getAnswer();
        List<String> distractors = getOrGenerateDistractors(flashcard);
        
        // Create options list: correct answer + distractors
        List<String> options = new ArrayList<>();
        options.add(correctAnswer);
        options.addAll(distractors);
        
        // Shuffle options so correct answer isn't always first
        Collections.shuffle(options);
        
        return MultipleChoiceQuestion.builder()
                .flashcardId(flashcard.getId())
                .position(sessionFlashcard.getPosition())
                .questionText(flashcard.getQuestion())
                .hint(flashcard.getHint())
                .options(options)
                .build();
    }
    
    private List<String> getOrGenerateDistractors(FlashcardEntity flashcard) {
        // Check if distractors are already cached
        String cached = flashcard.getDistractors();
        if (cached != null && !cached.isBlank()) {
            return parseDistractors(cached);
        }
        
        // Generate new distractors using AI
        List<String> distractors = distractorService.generateDistractors(
                flashcard.getQuestion(),
                flashcard.getAnswer(),
                DEFAULT_DISTRACTOR_COUNT
        );
        
        // Cache for future use
        cacheDistractors(flashcard, distractors);
        
        return distractors;
    }
    
    private List<String> parseDistractors(String cached) {
        return Arrays.stream(cached.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
    
    private void cacheDistractors(FlashcardEntity flashcard, List<String> distractors) {
        String cached = String.join(",", distractors);
        flashcard.setDistractors(cached);
        flashcardRepository.save(flashcard);
    }
    
    private String normalize(String s) {
        return s == null ? "" : s.trim().replaceAll("\\s+", " ").toLowerCase();
    }
}
