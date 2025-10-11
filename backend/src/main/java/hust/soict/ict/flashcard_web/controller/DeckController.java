import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/decks") 
public class DeckController {

    @PostMapping
    public String createDeck() {
        return "API endpoint to create a new deck";
    }

    @GetMapping
    public String getAllDecks() {
        return "API endpoint to get all decks";
    }
}