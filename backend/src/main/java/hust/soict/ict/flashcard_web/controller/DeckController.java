package hust.soict.ict.flashcard_web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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

    @GetMapping("/public")
    public ResponseEntity<List<DeckResponse>> getPublicDecks() {
        List<DeckResponse> decks = deckService.getPublicDecks();
        return ResponseEntity.ok(decks);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DeckResponse>> getMyDecks(Authentication authentication) {
        List<DeckResponse> decks = deckService.getMyDecks(authentication);
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

    @PatchMapping("/{deckId}/visibility")
    @PreAuthorize("isAuthenticated() and @securityService.isDeckOwner(#deckId, authentication)")
    public ResponseEntity<DeckResponse> toggleVisibility(
            @PathVariable Long deckId,
            @RequestBody java.util.Map<String, Boolean> body,
            Authentication authentication) {
        Boolean publicDeck = body.get("publicDeck");
        if (publicDeck == null) {
            return ResponseEntity.badRequest().build();
        }
        DeckResponse updatedDeck = deckService.updateVisibility(deckId, publicDeck, authentication);
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