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

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private UserRepository userRepository; 


    private UserEntity getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("Người dùng chưa được xác thực.");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + userEmail));
    }


    private void checkDeckOwnership(DeckEntity deck, UserEntity user) {
        if (!deck.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền truy cập hoặc chỉnh sửa Deck này.");
        }
    }

    private void checkFlashcardOwnership(FlashcardEntity flashcard, UserEntity user) {

        checkDeckOwnership(flashcard.getDeck(), user);
    }

    private FlashcardResponse convertToResponse(FlashcardEntity entity) {
        return new FlashcardResponse(
                entity.getId(),
                entity.getQuestion(),
                entity.getAnswer(),
                entity.getHint()
        );
    }


    public List<FlashcardResponse> getFlashcardsByDeck(Long deckId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Deck với ID: " + deckId));


        checkDeckOwnership(deck, currentUser);


        return flashcardRepository.findByDeck_Id(deckId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public FlashcardResponse createFlashcard(Long deckId, FlashcardRequest request) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity parentDeck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Deck với ID: " + deckId));


        checkDeckOwnership(parentDeck, currentUser);


        FlashcardEntity newFlashcard = new FlashcardEntity();
        newFlashcard.setQuestion(request.getQuestionText());
        newFlashcard.setAnswer(request.getAnswerText());
        newFlashcard.setHint(request.getHint());
        newFlashcard.setDeck(parentDeck);

        FlashcardEntity savedFlashcard = flashcardRepository.save(newFlashcard);
        return convertToResponse(savedFlashcard);
    }


    public FlashcardResponse updateFlashcard(Long flashcardId, FlashcardRequest request) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        FlashcardEntity existingFlashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Flashcard với ID: " + flashcardId));


        checkFlashcardOwnership(existingFlashcard, currentUser);


        existingFlashcard.setQuestion(request.getQuestionText());
        existingFlashcard.setAnswer(request.getAnswerText());
        existingFlashcard.setHint(request.getHint());

        FlashcardEntity updatedFlashcard = flashcardRepository.save(existingFlashcard);
        return convertToResponse(updatedFlashcard);
    }

    public void deleteFlashcard(Long flashcardId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        FlashcardEntity flashcardToDelete = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Flashcard với ID: " + flashcardId));


        checkFlashcardOwnership(flashcardToDelete, currentUser);
        

        flashcardRepository.delete(flashcardToDelete);
    }
}