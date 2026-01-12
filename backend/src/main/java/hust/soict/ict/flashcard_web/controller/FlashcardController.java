package hust.soict.ict.flashcard_web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hust.soict.ict.flashcard_web.dto.FlashcardRequest;
import hust.soict.ict.flashcard_web.dto.FlashcardResponse;
import hust.soict.ict.flashcard_web.dto.MessageResponse;
import hust.soict.ict.flashcard_web.service.FlashcardService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decks/{deckId}/flashcards")
public class FlashcardController {

    private final FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    /**
     * Get all flashcards in a deck
     * GET /api/decks/{deckId}/flashcards
     */
    @GetMapping
    @PreAuthorize("@securityService.canViewDeck(#deckId, authentication)")
    public ResponseEntity<List<FlashcardResponse>> getFlashcardsByDeck(
            @PathVariable Long deckId, 
            Authentication authentication) {
        List<FlashcardResponse> flashcards = flashcardService.getFlashcardsByDeck(deckId, authentication);
        return ResponseEntity.ok(flashcards);
    }

    /**
     * Get a single flashcard
     * GET /api/decks/{deckId}/flashcards/{flashcardId}
     */
    @GetMapping("/{flashcardId}")
    @PreAuthorize("@securityService.canViewDeck(#deckId, authentication)")
    public ResponseEntity<FlashcardResponse> getFlashcardById(
            @PathVariable Long deckId,
            @PathVariable Long flashcardId,
            Authentication authentication) {
        FlashcardResponse flashcard = flashcardService.getFlashcardById(deckId, flashcardId, authentication);
        return ResponseEntity.ok(flashcard);
    }

    /**
     * Create a new flashcard in a deck
     * POST /api/decks/{deckId}/flashcards
     */
    @PostMapping
    @PreAuthorize("isAuthenticated() and @securityService.isDeckOwner(#deckId, authentication)")
    public ResponseEntity<FlashcardResponse> createFlashcard(
            @PathVariable Long deckId, 
            @Valid @RequestBody FlashcardRequest request, 
            Authentication authentication) {
        FlashcardResponse newFlashcard = flashcardService.createFlashcard(deckId, request, authentication);
        return ResponseEntity.ok(newFlashcard);
    }

    /**
     * Update a flashcard
     * PUT /api/decks/{deckId}/flashcards/{flashcardId}
     */
    @PutMapping("/{flashcardId}")
    @PreAuthorize("isAuthenticated() and @securityService.isDeckOwner(#deckId, authentication)")
    public ResponseEntity<FlashcardResponse> updateFlashcard(
            @PathVariable Long deckId,
            @PathVariable Long flashcardId, 
            @Valid @RequestBody FlashcardRequest request, 
            Authentication authentication) {
        FlashcardResponse updatedFlashcard = flashcardService.updateFlashcard(deckId, flashcardId, request, authentication);
        return ResponseEntity.ok(updatedFlashcard);
    }

    /**
     * Delete a flashcard
     * DELETE /api/decks/{deckId}/flashcards/{flashcardId}
     */
    @DeleteMapping("/{flashcardId}")
    @PreAuthorize("isAuthenticated() and @securityService.isDeckOwner(#deckId, authentication)")
    public ResponseEntity<MessageResponse> deleteFlashcard(
            @PathVariable Long deckId,
            @PathVariable Long flashcardId, 
            Authentication authentication) {
        flashcardService.deleteFlashcard(deckId, flashcardId, authentication);
        return ResponseEntity.ok(new MessageResponse("Flashcard deleted successfully"));
    }
}
