package hust.soict.ict.flashcard_web.controller;

import hust.soict.ict.flashcard_web.dto.DeckRequest;
import hust.soict.ict.flashcard_web.dto.DeckResponse;
import hust.soict.ict.flashcard_web.service.DeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * This controller handles RESTful API requests related to decks.
 * It provides endpoints for creating, retrieving, updating, and deleting decks.
 * All operations are secured and require user authentication.
 */
@RestController
@RequestMapping("/api/decks")
public class DeckController {

    @Autowired
    private DeckService deckService;

    /**
     * Retrieves all decks belonging to the authenticated user.
     *
     * @return A `ResponseEntity` containing a list of `DeckResponse` objects.
     */
    @GetMapping
    public ResponseEntity<List<DeckResponse>> getAllDecks() {
        List<DeckResponse> decks = deckService.getAllDecks();
        return ResponseEntity.ok(decks);
    }

    /**
     * Creates a new deck for the authenticated user.
     *
     * @param request The request body containing the title and description of the new deck.
     * @return A `ResponseEntity` containing the created `DeckResponse` object.
     */
    @PostMapping
    public ResponseEntity<DeckResponse> createDeck(@RequestBody DeckRequest request) {
        DeckResponse newDeck = deckService.createDeck(request);
        return ResponseEntity.ok(newDeck);
    }

    /**
     * Retrieves a specific deck by its ID.
     * The user must be the owner of the deck.
     *
     * @param deckId The ID of the deck to retrieve.
     * @return A `ResponseEntity` containing the requested `DeckResponse` object.
     */
    @GetMapping("/{deckId}")
    public ResponseEntity<DeckResponse> getDeckById(@PathVariable Long deckId) {
        DeckResponse deck = deckService.getDeckById(deckId);
        return ResponseEntity.ok(deck);
    }

    /**
     * Updates an existing deck.
     * The user must be the owner of the deck.
     *
     * @param deckId  The ID of the deck to update.
     * @param request The request body with the updated title and description.
     * @return A `ResponseEntity` containing the updated `DeckResponse` object.
     */
    @PutMapping("/{deckId}")
    public ResponseEntity<DeckResponse> updateDeck(@PathVariable Long deckId, @RequestBody DeckRequest request) {
        DeckResponse updatedDeck = deckService.updateDeck(deckId, request);
        return ResponseEntity.ok(updatedDeck);
    }

    /**
     * Deletes a deck by its ID.
     * The user must be the owner of the deck.
     *
     * @param deckId The ID of the deck to delete.
     * @return A `ResponseEntity` with a success message.
     */
    @DeleteMapping("/{deckId}")
    public ResponseEntity<Map<String, String>> deleteDeck(@PathVariable Long deckId) {
        deckService.deleteDeck(deckId);
        Map<String, String> response = Collections.singletonMap("message", "Deck deleted successfully");
        return ResponseEntity.ok(response);
    }
}