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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hust.soict.ict.flashcard_web.dto.DeckRequest;
import hust.soict.ict.flashcard_web.dto.DeckResponse;
import hust.soict.ict.flashcard_web.dto.MessageResponse;
import hust.soict.ict.flashcard_web.service.DeckService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decks")
public class DeckController {

    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public ResponseEntity<List<DeckResponse>> getAllDecks(Authentication authentication) {
        List<DeckResponse> decks = deckService.getAllDecksPublicFiltered(authentication);
        return ResponseEntity.ok(decks);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DeckResponse>> searchDecks(
            @RequestParam(required = false, defaultValue = "") String keyword,
            Authentication authentication) {
        List<DeckResponse> decks = deckService.searchDecks(keyword, authentication);
        return ResponseEntity.ok(decks);
    }



    @PostMapping 
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeckResponse> createDeck(
            @Valid @RequestBody DeckRequest request, 
            Authentication authentication) {
        DeckResponse newDeck = deckService.createDeck(request, authentication);
        return ResponseEntity.ok(newDeck);
    }
    

    @GetMapping("/{deckId}")
    @PreAuthorize("@securityService.canViewDeck(#deckId, authentication)")
    public ResponseEntity<DeckResponse> getDeckById(
            @PathVariable Long deckId, 
            Authentication authentication) {
        DeckResponse deck = deckService.getDeckById(deckId, authentication);
        return ResponseEntity.ok(deck);
    }

    @PutMapping("/{deckId}")
    @PreAuthorize("isAuthenticated() and @securityService.isDeckOwner(#deckId, authentication)")
    public ResponseEntity<DeckResponse> updateDeck(
            @PathVariable Long deckId, 
            @Valid @RequestBody DeckRequest request, 
            Authentication authentication) {
        DeckResponse updatedDeck = deckService.updateDeck(deckId, request, authentication);
        return ResponseEntity.ok(updatedDeck);
    }

    @DeleteMapping("/{deckId}")
    @PreAuthorize("isAuthenticated() and @securityService.isDeckOwner(#deckId, authentication)")
    public ResponseEntity<MessageResponse> deleteDeck(
            @PathVariable Long deckId, 
            Authentication authentication) {
        deckService.deleteDeck(deckId, authentication);
        return ResponseEntity.ok(new MessageResponse("Deck deleted successfully"));
    }
}