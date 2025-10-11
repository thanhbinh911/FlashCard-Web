import org.springframework.stereotype.Service;

@Service
public class DeckService {

    public void createNewDeck() {
        System.out.println("Logic to create a deck is running...");
    }

    public void fetchAllDecks() {
        System.out.println("Logic to fetch all decks is running...");
    }
}

