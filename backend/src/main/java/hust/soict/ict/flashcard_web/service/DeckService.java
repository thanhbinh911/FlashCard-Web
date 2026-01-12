package hust.soict.ict.flashcard_web.service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hust.soict.ict.flashcard_web.dto.DeckRequest;
import hust.soict.ict.flashcard_web.dto.DeckResponse;
import hust.soict.ict.flashcard_web.dto.FlashcardRequest;
import hust.soict.ict.flashcard_web.entity.DeckEntity;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.entity.UserEntity;
import hust.soict.ict.flashcard_web.exception.AuthenticationRequiredException;
import hust.soict.ict.flashcard_web.exception.ResourceNotFoundException;
import hust.soict.ict.flashcard_web.repository.DeckRepository;
import hust.soict.ict.flashcard_web.repository.FlashcardRepository;
import hust.soict.ict.flashcard_web.repository.UserRepository;
import hust.soict.ict.flashcard_web.security.SecurityService;

@Service
public class DeckService {

    private final DeckRepository deckRepository;
    private final UserRepository userRepository;
    private final FlashcardRepository flashcardRepository;
    private final SecurityService securityService;

    public DeckService(DeckRepository deckRepository, UserRepository userRepository, 
                       FlashcardRepository flashcardRepository, SecurityService securityService) {
        this.deckRepository = deckRepository;
        this.userRepository = userRepository;
        this.flashcardRepository = flashcardRepository;
        this.securityService = securityService;
    }

    /**
     * Helper method to get deck entity by ID.
     * Throws ResourceNotFoundException if deck doesn't exist.
     */
    private DeckEntity getDeckEntityById(Long deckId) {
        return deckRepository.findById(deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
    }


    /**
     * Get flashcard counts for multiple decks in a single query.
     */
    private Map<Long, Integer> getFlashcardCountMap(List<Long> deckIds) {
        if (deckIds.isEmpty()) {
            return Collections.emptyMap();
        }
        Map<Long, Integer> countMap = new HashMap<>();
        List<Object[]> results = flashcardRepository.countByDeckIds(deckIds);
        for (Object[] row : results) {
            Long deckId = (Long) row[0];
            Long count = (Long) row[1];
            countMap.put(deckId, count.intValue());
        }
        return countMap;
    }

    /**
     * Helper method to convert deck entity to response object (single deck).
     */
    private DeckResponse convertToResponse(DeckEntity deck) {
        String formattedDate = (deck.getCreatedAt() != null)
                ? deck.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null;
        String ownerUsername = deck.getUser() != null ? deck.getUser().getUsername() : null;
        // Use repository count to avoid LazyInitializationException
        int flashcardCount = (int) flashcardRepository.countByDeck_Id(deck.getId());
        
        return new DeckResponse(
                deck.getId(), 
                deck.getTitle(), 
                deck.getDescription(), 
                formattedDate,
                deck.isPublicDeck(),
                ownerUsername,
                flashcardCount
        );
    }

    /**
     * Batch convert deck entities to responses (optimized - single COUNT query).
     */
    private List<DeckResponse> convertToResponses(List<DeckEntity> decks) {
        if (decks.isEmpty()) {
            return Collections.emptyList();
        }
        
        // Get all flashcard counts in one query
        List<Long> deckIds = decks.stream().map(DeckEntity::getId).collect(Collectors.toList());
        Map<Long, Integer> countMap = getFlashcardCountMap(deckIds);
        
        return decks.stream().map(deck -> {
            String formattedDate = (deck.getCreatedAt() != null)
                    ? deck.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                    : null;
            String ownerUsername = deck.getUser() != null ? deck.getUser().getUsername() : null;
            int flashcardCount = countMap.getOrDefault(deck.getId(), 0);
            
            return new DeckResponse(
                    deck.getId(),
                    deck.getTitle(),
                    deck.getDescription(),
                    formattedDate,
                    deck.isPublicDeck(),
                    ownerUsername,
                    flashcardCount
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeckResponse> getAllDecksPublicFiltered(Authentication authentication) {
        boolean isAdmin = securityService.isAdmin(authentication);
        Long authUserId = securityService.getAuthUserId(authentication);

        List<DeckEntity> decks;
        if (isAdmin) {
            decks = deckRepository.findAllWithUser();
        } else if (authUserId != null) {
            decks = deckRepository.findByUserIdOrPublic(authUserId);
        } else {
            decks = deckRepository.findPublicDecks();
        }
        return convertToResponses(decks);
    }

    /**
     * Get only public decks (optimized with batch count).
     */
    @Transactional(readOnly = true)
    public List<DeckResponse> getPublicDecks() {
        List<DeckEntity> decks = deckRepository.findPublicDecks();
        return convertToResponses(decks);
    }

    /**
     * Get only decks owned by the current user (optimized).
     */
    @Transactional(readOnly = true)
    public List<DeckResponse> getMyDecks(Authentication authentication) {
        Long authUserId = securityService.getAuthUserId(authentication);
        if (authUserId == null) {
            return Collections.emptyList();
        }
        List<DeckEntity> decks = deckRepository.findByUser_Id(authUserId);
        return convertToResponses(decks);
    }

    /**
     * Create a new deck with optional flashcards.
     * If flashcards are provided in the request, they will be created along with the deck.
     */
    @Transactional
    public DeckResponse createDeck(DeckRequest req, Authentication authentication) {
        Long authUserId = securityService.getAuthUserId(authentication);
        if (authUserId == null) {
            throw new AuthenticationRequiredException("Please login or register to create a deck");
        }

        UserEntity user = userRepository.findById(authUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        DeckEntity deck = new DeckEntity();
        deck.setTitle(req.getTitle());
        deck.setDescription(req.getDescription());
        deck.setUser(user);
        deck.setPublicDeck(req.isPublicDeck());

        DeckEntity saved = deckRepository.save(deck);
        
        // Create flashcards (required - minimum 2)
        List<FlashcardEntity> flashcards = new ArrayList<>();
        for (FlashcardRequest fc : req.getFlashcards()) {
            FlashcardEntity flashcard = new FlashcardEntity();
            flashcard.setQuestion(fc.getQuestionText());
            flashcard.setAnswer(fc.getAnswerText());
            flashcard.setHint(fc.getHint());
            flashcard.setDeck(saved);
            flashcards.add(flashcard);
        }
        flashcardRepository.saveAll(flashcards);
        
        return convertToResponse(saved);
    }

    public DeckResponse getDeckById(Long deckId, Authentication authentication) {
        DeckEntity deck = getDeckEntityById(deckId);
        checkReadAccess(deckId, authentication);
        return convertToResponse(deck);
    }

    public DeckResponse updateDeck(Long deckId, DeckRequest req, Authentication authentication) {
        DeckEntity deck = getDeckEntityById(deckId);
        checkWriteAccess(deckId, authentication);

        deck.setTitle(req.getTitle());
        deck.setDescription(req.getDescription());
        deck.setPublicDeck(req.isPublicDeck());

        DeckEntity saved = deckRepository.save(deck);
        return convertToResponse(saved);
    }

    /**
     * Update only the visibility of a deck (public/private).
     * Dedicated method to avoid requiring flashcards for a visibility-only update.
     */
    @Transactional
    public DeckResponse updateVisibility(Long deckId, boolean publicDeck, Authentication authentication) {
        DeckEntity deck = getDeckEntityById(deckId);
        checkWriteAccess(deckId, authentication);
        
        deck.setPublicDeck(publicDeck);
        DeckEntity saved = deckRepository.save(deck);
        return convertToResponse(saved);
    }

    public void deleteDeck(Long deckId, Authentication authentication) {
        getDeckEntityById(deckId); 
        checkWriteAccess(deckId, authentication);
        deckRepository.deleteById(deckId);
    }

    /**
     * Search decks by keyword in title, description, or category name.
     * Filters results based on access control (public decks, user's own decks, or admin).
     */
    @Transactional(readOnly = true)
    public List<DeckResponse> searchDecks(String keyword, Authentication authentication) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllDecksPublicFiltered(authentication);
        }

        boolean isAdmin = securityService.isAdmin(authentication);
        Long authUserId = securityService.getAuthUserId(authentication);

        List<DeckEntity> decks;
        if (isAdmin) {
            // Admin sees all decks
            decks = deckRepository.searchByKeyword(keyword.trim());
        } else if (authUserId != null) {
            // User sees public + their own
            decks = deckRepository.searchByKeywordForUser(keyword.trim(), authUserId);
        } else {
            // Anonymous - public only (filter in memory from general search)
            decks = deckRepository.searchByKeyword(keyword.trim()).stream()
                    .filter(DeckEntity::isPublicDeck)
                    .collect(Collectors.toList());
        }
        return convertToResponses(decks);
    }

    /**
     * Check if user has read access to a deck.
     * Throws AccessDeniedException if not authorized.
     */
    public void checkReadAccess(Long deckId, Authentication authentication) {
        if (!securityService.canViewDeck(deckId, authentication)) {
            throw new AccessDeniedException("Not authorized to view this deck");
        }
    }

    /**
     * Check if user has write access to a deck.
     * Only the deck owner can modify their deck.
     * Throws AccessDeniedException if not authorized.
     */
    public void checkWriteAccess(Long deckId, Authentication authentication) {
        if (!securityService.isDeckOwner(deckId, authentication)) {
            throw new AccessDeniedException("Not authorized to modify this deck");
        }
    }
}
