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

/**
 * This controller handles RESTful API requests related to flashcards.
 * It provides endpoints for creating, retrieving, updating, and deleting flashcards
 * within the context of a specific deck. All operations are secured and require
 * user authentication and ownership of the parent deck.
 */
@RestController
@RequestMapping("/api")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    /**
     * Retrieves all flashcards associated with a specific deck.
     * The user must be the owner of the deck.
     *
     * @param deckId The ID of the deck from which to retrieve flashcards.
     * @return A `ResponseEntity` containing a list of `FlashcardResponse` objects.
     */
    @GetMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<List<FlashcardResponse>> getFlashcardsByDeck(@PathVariable Long deckId) {
        List<FlashcardResponse> flashcards = flashcardService.getFlashcardsByDeck(deckId);
        return ResponseEntity.ok(flashcards);
    }

    /**
     * Creates a new flashcard within a specific deck.
     * The user must be the owner of the deck.
     *
     * @param deckId  The ID of the deck where the new flashcard will be created.
     * @param request The request body containing the details of the new flashcard (question, answer, hint).
     * @return A `ResponseEntity` containing the created `FlashcardResponse` object.
     */
    @PostMapping("/decks/{deckId}/flashcards")
    public ResponseEntity<FlashcardResponse> createFlashcard(@PathVariable Long deckId, @RequestBody FlashcardRequest request) {
        FlashcardResponse newFlashcard = flashcardService.createFlashcard(deckId, request);
        return ResponseEntity.ok(newFlashcard);
    }

    /**
     * Updates an existing flashcard.
     * The user must be the owner of the flashcard's parent deck.
     *
     * @param flashcardId The ID of the flashcard to update.
     * @param request     The request body with the updated flashcard details.
     * @return A `ResponseEntity` containing the updated `FlashcardResponse` object.
     */
    @PutMapping("/flashcards/{flashcardId}")
    public ResponseEntity<FlashcardResponse> updateFlashcard(@PathVariable Long flashcardId, @RequestBody FlashcardRequest request) {
        FlashcardResponse updatedFlashcard = flashcardService.updateFlashcard(flashcardId, request);
        return ResponseEntity.ok(updatedFlashcard);
    }

    /**
     * Deletes a flashcard by its ID.
     * The user must be the owner of the flashcard's parent deck.
     *
     * @param flashcardId The ID of the flashcard to delete.
     * @return A `ResponseEntity` with a success message.
     */
    @DeleteMapping("/flashcards/{flashcardId}")
    public ResponseEntity<Map<String, String>> deleteFlashcard(@PathVariable Long flashcardId) {
        flashcardService.deleteFlashcard(flashcardId);
        Map<String, String> response = Collections.singletonMap("message", "Flashcard deleted successfully");
        return ResponseEntity.ok(response);
    }
}