package hust.soict.ict.flashcard_web.service;

import hust.soict.ict.flashcard_web.dto.DeckRequest;
import hust.soict.ict.flashcard_web.dto.DeckResponse;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DeckService {

    // Giả lập một danh sách decks trong bộ nhớ để làm việc với
    private final List<DeckResponse> mockDecks = new ArrayList<>(Arrays.asList(
        new DeckResponse(1L, "Học từ vựng IELTS", "Các từ vựng band 8.0", "2025-10-16T21:30:00Z"),
        new DeckResponse(2L, "Lịch sử Việt Nam", "Các mốc sự kiện quan trọng", "2025-10-15T10:00:00Z")
    ));

    public List<DeckResponse> getAllDecks() {
        System.out.println("Mock API: Lấy tất cả decks.");
        return mockDecks;
    }

    public DeckResponse getDeckById(Long deckId) {
        System.out.println("Mock API: Lấy chi tiết deck có ID: " + deckId);
        return mockDecks.stream()
                        .filter(deck -> deck.getId().equals(deckId))
                        .findFirst()
                        .orElse(mockDecks.get(0));
    }

    public DeckResponse createDeck(DeckRequest request) {
        System.out.println("Mock API: Đã nhận yêu cầu tạo deck: " + request.getTitle());
        DeckResponse newDeck = new DeckResponse(
            (long) (mockDecks.size() + 1),
            request.getTitle(),
            request.getDescription(),
            Instant.now().toString()
        );
        mockDecks.add(newDeck);
        return newDeck;
    }

    public DeckResponse updateDeck(Long deckId, DeckRequest request) {
        System.out.println("Mock API: Cập nhật deck có ID: " + deckId);
        return new DeckResponse(
            deckId,
            request.getTitle(),
            request.getDescription(),
            Instant.now().toString()
        );
    }

    public void deleteDeck(Long deckId) {
        System.out.println("Mock API: Xóa deck có ID: " + deckId);
    }
}