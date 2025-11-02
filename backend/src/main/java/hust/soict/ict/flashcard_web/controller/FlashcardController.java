package hust.soict.ict.flashcard_web.controller;

import hust.soict.ict.flashcard_web.dto.FlashcardRequest;
import hust.soict.ict.flashcard_web.dto.FlashcardResponse;
import hust.soict.ict.flashcard_web.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // Sử dụng RequestMapping gốc để xử lý các endpoint lồng nhau
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<List<FlashcardResponse>> getFlashcardsByDeck(@PathVariable Long deckId) {
        List<FlashcardResponse> flashcards = flashcardService.getFlashcardsByDeck(deckId);
        return ResponseEntity.ok(flashcards);
    }

    @PostMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<FlashcardResponse> createFlashcard(@PathVariable Long deckId, @RequestBody FlashcardRequest request) {
        FlashcardResponse newFlashcard = flashcardService.createFlashcard(deckId, request);
        return ResponseEntity.ok(newFlashcard);
    }

    @PutMapping("/flashcards/{flashcardId}")
    public ResponseEntity<FlashcardResponse> updateFlashcard(@PathVariable Long flashcardId, @RequestBody FlashcardRequest request) {
        FlashcardResponse updatedFlashcard = flashcardService.updateFlashcard(flashcardId, request);
        return ResponseEntity.ok(updatedFlashcard);
    }

    @DeleteMapping("/flashcards/{flashcardId}")
    public ResponseEntity<Map<String, String>> deleteFlashcard(@PathVariable Long flashcardId) {
        flashcardService.deleteFlashcard(flashcardId);
        // Trả về message khớp với hợp đồng API
        Map<String, String> response = Collections.singletonMap("message", "Flashcard deleted successfully");
        return ResponseEntity.ok(response);
    }
}