package hust.soict.ict.flashcard_web.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import hust.soict.ict.flashcard_web.dto.FlashcardRequest;
import hust.soict.ict.flashcard_web.dto.FlashcardResponse;
import hust.soict.ict.flashcard_web.entity.DeckEntity;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.repository.exception.ResourceNotFoundException;
import hust.soict.ict.flashcard_web.repository.DeckRepository;
import hust.soict.ict.flashcard_web.repository.FlashcardRepository;

@Service
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final DeckRepository deckRepository;
    private final DeckService deckService;

    public FlashcardService(FlashcardRepository flashcardRepository, DeckRepository deckRepository, DeckService deckService) {
        this.flashcardRepository = flashcardRepository;
        this.deckRepository = deckRepository;
        this.deckService = deckService;
    }

    private FlashcardResponse convertToResponse(FlashcardEntity entity) {
        return new FlashcardResponse(
                entity.getId(),
                entity.getQuestion(),
                entity.getAnswer(),
                entity.getHint()
        );
    }

    /**
     * Validate that a flashcard belongs to the specified deck.
     * Throws ResourceNotFoundException if flashcard doesn't exist or doesn't belong to deck.
     * reusable private helper 
     * 
     */
    private FlashcardEntity getFlashcardInDeck(Long deckId, Long flashcardId) {
        FlashcardEntity flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found"));
        
        if (!flashcard.getDeck().getId().equals(deckId)) {
            throw new ResourceNotFoundException("Flashcard does not belong to the specified deck");
        }
        
        return flashcard;
    }

    public List<FlashcardResponse> getFlashcardsByDeck(Long deckId, Authentication authentication) {
        // Check read access to deck
        deckService.checkReadAccess(deckId, authentication);

        return flashcardRepository.findByDeck_Id(deckId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public FlashcardResponse getFlashcardById(Long deckId, Long flashcardId, Authentication authentication) {
        // Check read access to deck
        deckService.checkReadAccess(deckId, authentication);
        
        // Get flashcard and validate it belongs to the deck
        FlashcardEntity flashcard = getFlashcardInDeck(deckId, flashcardId);
        
        return convertToResponse(flashcard);
    }

    

    public FlashcardResponse createFlashcard(Long deckId, FlashcardRequest request, Authentication authentication) {
        deckService.checkWriteAccess(deckId, authentication);

        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));

        FlashcardEntity flashcard = new FlashcardEntity();
        flashcard.setQuestion(request.getQuestionText());
        flashcard.setAnswer(request.getAnswerText());
        flashcard.setHint(request.getHint());
        flashcard.setDeck(deck);

        return convertToResponse(flashcardRepository.save(flashcard));
    }

    public FlashcardResponse updateFlashcard(Long deckId, Long flashcardId, FlashcardRequest request, Authentication authentication) {
        deckService.checkWriteAccess(deckId, authentication);
        
        // Get flashcard and validate it belongs to the deck
        FlashcardEntity flashcard = getFlashcardInDeck(deckId, flashcardId);

        flashcard.setQuestion(request.getQuestionText());
        flashcard.setAnswer(request.getAnswerText());
        flashcard.setHint(request.getHint());

        return convertToResponse(flashcardRepository.save(flashcard));
    }

    public void deleteFlashcard(Long deckId, Long flashcardId, Authentication authentication) {
        deckService.checkWriteAccess(deckId, authentication);
        
        // Get flashcard and validate it belongs to the deck
        FlashcardEntity flashcard = getFlashcardInDeck(deckId, flashcardId);

        flashcardRepository.delete(flashcard);
    }
}