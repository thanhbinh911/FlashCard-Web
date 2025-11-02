package hust.soict.ict.flashcard_web.service;

import hust.soict.ict.flashcard_web.dto.FlashcardRequest;
import hust.soict.ict.flashcard_web.dto.FlashcardResponse;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class FlashcardService {

    public List<FlashcardResponse> getFlashcardsByDeck(Long deckId) {
        System.out.println("Mock API: Lấy flashcards cho deck có ID: " + deckId);
        return Arrays.asList(
            new FlashcardResponse(10L, "What is API?", "Application Programming Interface"),
            new FlashcardResponse(11L, "What is a Monorepo?", "A single repository containing multiple projects")
        );
    }

    public FlashcardResponse createFlashcard(Long deckId, FlashcardRequest request) {
        System.out.println("Mock API: Tạo flashcard mới trong deck ID: " + deckId);
        return new FlashcardResponse(12L, request.getQuestionText(), request.getAnswerText());
    }

    public FlashcardResponse updateFlashcard(Long flashcardId, FlashcardRequest request) {
        System.out.println("Mock API: Cập nhật flashcard có ID: " + flashcardId);
        return new FlashcardResponse(flashcardId, request.getQuestionText(), request.getAnswerText());
    }

    public void deleteFlashcard(Long flashcardId) {
        System.out.println("Mock API: Xóa flashcard có ID: " + flashcardId);
    }
}