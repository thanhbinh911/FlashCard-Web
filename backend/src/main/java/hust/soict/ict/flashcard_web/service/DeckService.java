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

@Service
public class DeckService {

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


    public List<DeckResponse> getAllDecks() {
        UserEntity currentUser = getCurrentAuthenticatedUser();


        return deckRepository.findByUser_Id(currentUser.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public DeckResponse getDeckById(Long deckId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Deck với ID: " + deckId));


        checkDeckOwnership(deck, currentUser);

        return convertToResponse(deck);
    }

  
    public DeckResponse createDeck(DeckRequest request) {

        UserEntity currentUser = getCurrentAuthenticatedUser();


        DeckEntity newDeck = new DeckEntity();
        newDeck.setTitle(request.getTitle());
        newDeck.setDescription(request.getDescription());
        

        newDeck.setUser(currentUser);

        DeckEntity savedDeck = deckRepository.save(newDeck);
        return convertToResponse(savedDeck);
    }

    public DeckResponse updateDeck(Long deckId, DeckRequest request) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity existingDeck = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Deck với ID: " + deckId));


        checkDeckOwnership(existingDeck, currentUser);

        existingDeck.setTitle(request.getTitle());
        existingDeck.setDescription(request.getDescription());

        DeckEntity updatedDeck = deckRepository.save(existingDeck);
        return convertToResponse(updatedDeck);
    }


    public void deleteDeck(Long deckId) {
        UserEntity currentUser = getCurrentAuthenticatedUser();
        DeckEntity deckToDelete = deckRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Deck với ID: " + deckId));


        checkDeckOwnership(deckToDelete, currentUser);

        deckRepository.delete(deckToDelete);
    }
}