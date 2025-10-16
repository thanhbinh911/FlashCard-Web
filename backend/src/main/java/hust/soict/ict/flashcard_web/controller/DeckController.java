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

@RestController
@RequestMapping("/api/decks")
public class DeckController {

    @Autowired
    private DeckService deckService;

    @GetMapping
    public ResponseEntity<List<DeckResponse>> getAllDecks() {
        List<DeckResponse> decks = deckService.getAllDecks();
        return ResponseEntity.ok(decks);
    }

    @PostMapping
    public ResponseEntity<DeckResponse> createDeck(@RequestBody DeckRequest request) {
        DeckResponse newDeck = deckService.createDeck(request);
        return ResponseEntity.ok(newDeck);
    }

    @GetMapping("/{deckId}")
    public ResponseEntity<DeckResponse> getDeckById(@PathVariable Long deckId) {
        DeckResponse deck = deckService.getDeckById(deckId);
        return ResponseEntity.ok(deck);
    }

    @PutMapping("/{deckId}")
    public ResponseEntity<DeckResponse> updateDeck(@PathVariable Long deckId, @RequestBody DeckRequest request) {
        DeckResponse updatedDeck = deckService.updateDeck(deckId, request);
        return ResponseEntity.ok(updatedDeck);
    }

    @DeleteMapping("/{deckId}")
    public ResponseEntity<Map<String, String>> deleteDeck(@PathVariable Long deckId) {
        deckService.deleteDeck(deckId);
        // Trả về message khớp với hợp đồng API
        Map<String, String> response = Collections.singletonMap("message", "Deck deleted successfully");
        return ResponseEntity.ok(response);
    }
}