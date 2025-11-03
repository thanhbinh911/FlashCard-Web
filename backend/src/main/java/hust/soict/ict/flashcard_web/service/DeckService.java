package hust.soict.ict.flashcard_web.service;

import hust.soict.ict.flashcard_web.dto.DeckRequest;
import hust.soict.ict.flashcard_web.dto.DeckResponse;
import hust.soict.ict.flashcard_web.entity.DeckEntity;
import hust.soict.ict.flashcard_web.entity.UserEntity;
import hust.soict.ict.flashcard_web.repository.DeckRepository;
import hust.soict.ict.flashcard_web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * This service class handles business logic related to decks.
 * It provides methods for creating, retrieving, updating, and deleting decks,
 * ensuring that users can only operate on their own decks.
 */
@Service
public class DeckService {

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieves the currently authenticated user from the security context.
     *
     * @return the `UserEntity` of the authenticated user.
     * @throws RuntimeException if the user is not authenticated or not found in the database.
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
     * @throws RuntimeException if the user is not the owner of the deck.
     */
    private void checkDeckOwnership(DeckEntity deck, UserEntity user) {
        if (!deck.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You do not have permission to access or modify this deck.");
        }
    }

    /**
     * Converts a `DeckEntity` object to a `DeckResponse` DTO.
     *
     * @param entity the `DeckEntity` to convert.
     * @return the corresponding `DeckResponse` object.
     */
    private DeckResponse convertToResponse(DeckEntity entity) {
        String formattedDate = (entity.getCreatedAt() != null)
                ? entity.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : null;

        return new DeckResponse(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                formattedDate
        );
    }

    /**
     * Retrieves all decks belonging to the currently authenticated user.
     *
     * @return a list of `DeckResponse` objects.
     */
    public List<DeckResponse> getAllDecks() {
        UserEntity currentUser = getCurrentAuthenticatedUser();

        return deckRepository.findByUser_Id(currentUser.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a specific deck by its ID.
     * Ensures that the deck belongs to the currently authenticated user.
     *
     * @param deckId the ID of the deck to retrieve.
     * @return the `DeckResponse` object.
     * @throws RuntimeException if the deck is not found or the user is not the owner.
     */
    public DeckResponse getDeckById(Long deckId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found with ID: " + deckId));

        checkDeckOwnership(deck, currentUser);

        return convertToResponse(deck);
    }

    /**
     * Creates a new deck for the currently authenticated user.
     *
     * @param request the `DeckRequest` object containing the new deck's data.
     * @return the `DeckResponse` object for the newly created deck.
     */
    public DeckResponse createDeck(DeckRequest request) {
        UserEntity currentUser = getCurrentAuthenticatedUser();

        DeckEntity newDeck = new DeckEntity();
        newDeck.setTitle(request.getTitle());
        newDeck.setDescription(request.getDescription());
        newDeck.setUser(currentUser);

        DeckEntity savedDeck = deckRepository.save(newDeck);
        return convertToResponse(savedDeck);
    }

    /**
     * Updates an existing deck.
     * Ensures that the deck belongs to the currently authenticated user.
     *
     * @param deckId  the ID of the deck to update.
     * @param request the `DeckRequest` object with the updated data.
     * @return the `DeckResponse` object for the updated deck.
     * @throws RuntimeException if the deck is not found or the user is not the owner.
     */
    public DeckResponse updateDeck(Long deckId, DeckRequest request) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity existingDeck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found with ID: " + deckId));

        checkDeckOwnership(existingDeck, currentUser);

        existingDeck.setTitle(request.getTitle());
        existingDeck.setDescription(request.getDescription());

        DeckEntity updatedDeck = deckRepository.save(existingDeck);
        return convertToResponse(updatedDeck);
    }

    /**
     * Deletes a deck by its ID.
     * Ensures that the deck belongs to the currently authenticated user.
     *
     * @param deckId the ID of the deck to delete.
     * @throws RuntimeException if the deck is not found or the user is not the owner.
     */
    public void deleteDeck(Long deckId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity deckToDelete = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found with ID: " + deckId));

        checkDeckOwnership(deckToDelete, currentUser);

        deckRepository.delete(deckToDelete);
    }
}