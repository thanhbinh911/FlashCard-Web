package hust.soict.ict.flashcard_web.security;


import java.util.Optional;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import hust.soict.ict.flashcard_web.entity.DeckEntity;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.repository.DeckRepository;
import hust.soict.ict.flashcard_web.repository.FlashcardRepository;
import hust.soict.ict.flashcard_web.repository.StudySessionRepository;

@Service("securityService")
public class SecurityService {
    private final DeckRepository deckRepository;
    private final FlashcardRepository flashcardRepository;
    private final StudySessionRepository sessionRepository;

    public SecurityService(DeckRepository deckRepository, FlashcardRepository flashcardRepository,
                           StudySessionRepository sessionRepository) {
        this.deckRepository = deckRepository;
        this.flashcardRepository = flashcardRepository;
        this.sessionRepository = sessionRepository;
    }

    public Long getAuthUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated())
            return null;

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        }
        return null;
    }

    public boolean isAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated())
            return false;
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    public boolean isDeckOwner(Long deckId, Authentication authentication) {
        if (deckId == null)
            return false;
        Long authUserId = getAuthUserId(authentication);
        if (authUserId == null)
            return false;
        
        Optional<DeckEntity> deckOpt = deckRepository.findById(deckId);
        if (deckOpt.isEmpty())
            return false;
        
        DeckEntity deck = deckOpt.get();
        return deck.getUser() != null && authUserId.equals(deck.getUser().getId());
    }

    /**
     * Check if user can view a deck.
     * Returns true if: deck is public, OR user is owner, OR user is admin.
     */
    public boolean canViewDeck(Long deckId, Authentication authentication) {
        if (deckId == null)
            return false;
        
        Optional<DeckEntity> deckOpt = deckRepository.findById(deckId);
        if (deckOpt.isEmpty())
            return false;
        
        DeckEntity deck = deckOpt.get();
        
        // Public decks can be viewed by anyone
        if (deck.isPublic())
            return true;
        
        // Private decks: check if owner or admin
        return isDeckOwner(deckId, authentication) || isAdmin(authentication);
    }

    /**
     * Check if user can view a specific flashcard.
     * Returns true if: parent deck is public, OR user is owner, OR user is admin.
     */
    public boolean canViewFlashcard(Long flashcardId, Authentication authentication) {
        if (flashcardId == null)
            return false;
        
        Optional<FlashcardEntity> flashcardOpt = flashcardRepository.findById(flashcardId);
        if (flashcardOpt.isEmpty())
            return false;
        
        FlashcardEntity flashcard = flashcardOpt.get();
        if (flashcard.getDeck() == null)
            return false;
        
        return canViewDeck(flashcard.getDeck().getId(), authentication);
    }

    public boolean isFlashcardOwner(Long flashcardId, Authentication authentication) {
        if (flashcardId == null)
            return false;
        Long authUserId = getAuthUserId(authentication);
        if (authUserId == null)
            return false;
        
        Optional<FlashcardEntity> flashcardOpt = flashcardRepository.findById(flashcardId);
        if (flashcardOpt.isEmpty())
            return false;
        
        FlashcardEntity flashcard = flashcardOpt.get();
        return flashcard.getDeck() != null &&
                flashcard.getDeck().getUser() != null &&
                authUserId.equals(flashcard.getDeck().getUser().getId());
    }

    /**
     * Check if user owns a study session.
     */
    public boolean isSessionOwner(Long sessionId, Authentication authentication) {
        if (sessionId == null)
            return false;
        Long authUserId = getAuthUserId(authentication);
        if (authUserId == null)
            return false;
        return sessionRepository.findById(sessionId)
                .map(s -> s.getUser() != null && authUserId.equals(s.getUser().getId()))
                .orElse(false);
    }

    /**
     * Verify session ownership and throw AccessDeniedException if not owner.
     */
    public void verifySessionOwnership(Long sessionId, Authentication authentication) {
        if (!isSessionOwner(sessionId, authentication)) {
            throw new AccessDeniedException("You don't have access to this session");
        }
    }
}

