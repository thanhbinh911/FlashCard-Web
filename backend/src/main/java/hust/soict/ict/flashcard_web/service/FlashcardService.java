package hust.soict.ict.flashcard_web.service;

import hust.soict.ict.flashcard_web.dto.FlashcardRequest;
import hust.soict.ict.flashcard_web.dto.FlashcardResponse;
import hust.soict.ict.flashcard_web.entity.DeckEntity;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.entity.UserEntity;
import hust.soict.ict.flashcard_web.repository.DeckRepository;
import hust.soict.ict.flashcard_web.repository.FlashcardRepository;
import hust.soict.ict.flashcard_web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * This service class handles business logic related to flashcards.
 * It provides methods for creating, retrieving, updating, and deleting flashcards within a specific deck,
 * ensuring that users can only manage flashcards in decks they own.
 */
@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieves the currently authenticated user from the security context.
     *
     * @return the `UserEntity` of the authenticated user.
     * @throws RuntimeException if the user is not authenticated or not found.
     */
    private UserEntity getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("User is not authenticated.");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
    }

    /**
     * Checks if the given user is the owner of the specified deck.
     *
     * @param deck the deck to check.
     * @param user the user to verify.
     * @throws RuntimeException if the user does not own the deck.
     */
    private void checkDeckOwnership(DeckEntity deck, UserEntity user) {
        if (!deck.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You do not have permission to access or modify this deck.");
        }
    }

    /**
     * Checks if the given user is the owner of the specified flashcard by checking the ownership of its parent deck.
     *
     * @param flashcard the flashcard to check.
     * @param user      the user to verify.
     */
    private void checkFlashcardOwnership(FlashcardEntity flashcard, UserEntity user) {
        checkDeckOwnership(flashcard.getDeck(), user);
    }

    /**
     * Converts a `FlashcardEntity` object to a `FlashcardResponse` DTO.
     *
     * @param entity the `FlashcardEntity` to convert.
     * @return the corresponding `FlashcardResponse` object.
     */
    private FlashcardResponse convertToResponse(FlashcardEntity entity) {
        return new FlashcardResponse(
                entity.getId(),
                entity.getQuestion(),
                entity.getAnswer(),
                entity.getHint()
        );
    }

    /**
     * Retrieves all flashcards belonging to a specific deck.
     * Ensures the user owns the deck before retrieving the flashcards.
     *
     * @param deckId the ID of the deck.
     * @return a list of `FlashcardResponse` objects.
     * @throws RuntimeException if the deck is not found or the user does not own it.
     */
    public List<FlashcardResponse> getFlashcardsByDeck(Long deckId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found with ID: " + deckId));

        checkDeckOwnership(deck, currentUser);

        return flashcardRepository.findByDeck_Id(deckId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new flashcard within a specified deck.
     * Ensures the user owns the deck before creating the flashcard.
     *
     * @param deckId  the ID of the deck where the flashcard will be added.
     * @param request the `FlashcardRequest` object containing the new flashcard's data.
     * @return the `FlashcardResponse` for the newly created flashcard.
     * @throws RuntimeException if the deck is not found or the user does not own it.
     */
    public FlashcardResponse createFlashcard(Long deckId, FlashcardRequest request) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity parentDeck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found with ID: " + deckId));

        checkDeckOwnership(parentDeck, currentUser);

        FlashcardEntity newFlashcard = new FlashcardEntity();
        newFlashcard.setQuestion(request.getQuestionText());
        newFlashcard.setAnswer(request.getAnswerText());
        newFlashcard.setHint(request.getHint());
        newFlashcard.setDeck(parentDeck);

        FlashcardEntity savedFlashcard = flashcardRepository.save(newFlashcard);
        return convertToResponse(savedFlashcard);
    }

    /**
     * Updates an existing flashcard.
     * Ensures the user owns the flashcard before updating it.
     *
     * @param flashcardId the ID of the flashcard to update.
     * @param request     the `FlashcardRequest` with the updated data.
     * @return the `FlashcardResponse` for the updated flashcard.
     * @throws RuntimeException if the flashcard is not found or the user does not own it.
     */
    public FlashcardResponse updateFlashcard(Long flashcardId, FlashcardRequest request) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        FlashcardEntity existingFlashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found with ID: " + flashcardId));

        checkFlashcardOwnership(existingFlashcard, currentUser);

        existingFlashcard.setQuestion(request.getQuestionText());
        existingFlashcard.setAnswer(request.getAnswerText());
        existingFlashcard.setHint(request.getHint());

        FlashcardEntity updatedFlashcard = flashcardRepository.save(existingFlashcard);
        return convertToResponse(updatedFlashcard);
    }

    /**
     * Deletes a flashcard by its ID.
     * Ensures the user owns the flashcard before deleting it.
     *
     * @param flashcardId the ID of the flashcard to delete.
     * @throws RuntimeException if the flashcard is not found or the user does not own it.
     */
    public void deleteFlashcard(Long flashcardId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        FlashcardEntity flashcardToDelete = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard not found with ID: " + flashcardId));

        checkFlashcardOwnership(flashcardToDelete, currentUser);

        flashcardRepository.delete(flashcardToDelete);
    }
}