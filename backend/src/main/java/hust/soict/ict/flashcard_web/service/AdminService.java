package hust.soict.ict.flashcard_web.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hust.soict.ict.flashcard_web.dto.AdminDashboardResponse;
import hust.soict.ict.flashcard_web.dto.AdminDeckResponse;
import hust.soict.ict.flashcard_web.dto.AdminUserResponse;
import hust.soict.ict.flashcard_web.dto.FlashcardResponse;
import hust.soict.ict.flashcard_web.entity.StudySessionEntity;
import hust.soict.ict.flashcard_web.entity.UserEntity;
import hust.soict.ict.flashcard_web.repository.DeckRepository;
import hust.soict.ict.flashcard_web.repository.FlashcardRepository;
import hust.soict.ict.flashcard_web.repository.StudySessionRepository;
import hust.soict.ict.flashcard_web.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DeckRepository deckRepository;
    private final FlashcardRepository flashcardRepository;
    private final StudySessionRepository studySessionRepository;

    public AdminService(UserRepository userRepository, DeckRepository deckRepository,
                        FlashcardRepository flashcardRepository, StudySessionRepository studySessionRepository) {
        this.userRepository = userRepository;
        this.deckRepository = deckRepository;
        this.flashcardRepository = flashcardRepository;
        this.studySessionRepository = studySessionRepository;
    }

    /**
     * Get dashboard statistics for admin.
     */
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalDecks = deckRepository.count();
        long totalFlashcards = flashcardRepository.count();
        long totalSessions = studySessionRepository.count();

        // Count active (in-progress) sessions using repository method
        List<StudySessionEntity> activeSessions = studySessionRepository.findByStatusAndTimeLimitSecondsIsNotNull(
                StudySessionEntity.SessionStatus.IN_PROGRESS);
        long activeSessionsCount = activeSessions.size();

        // Get recent user activity (last 10 users with activity)
        List<UserEntity> users = userRepository.findAll();
        List<AdminDashboardResponse.RecentUserActivity> recentActivity = users.stream()
                .sorted((u1, u2) -> {
                    if (u1.getLastLogin() == null && u2.getLastLogin() == null) return 0;
                    if (u1.getLastLogin() == null) return 1;
                    if (u2.getLastLogin() == null) return -1;
                    return u2.getLastLogin().compareTo(u1.getLastLogin());
                })
                .limit(10)
                .map(u -> new AdminDashboardResponse.RecentUserActivity(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getLastLogin(),
                        u.getDecks() != null ? u.getDecks().size() : 0,
                        u.getStudySessions() != null ? u.getStudySessions().size() : 0
                ))
                .collect(Collectors.toList());

        return new AdminDashboardResponse(
                totalUsers,
                totalDecks,
                totalFlashcards,
                totalSessions,
                activeSessionsCount,
                recentActivity
        );
    }

    /**
     * Get all users for admin.
     */
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new AdminUserResponse(
                        u.getId(),
                        u.getUsername(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getRole() != null ? u.getRole().name() : null,
                        u.getLastLogin(),
                        u.getDecks() != null ? u.getDecks().size() : 0,
                        u.getStudySessions() != null ? u.getStudySessions().size() : 0
                ))
                .collect(Collectors.toList());
    }

    /**
     * Get all decks for admin.
     */
    @Transactional(readOnly = true)
    public List<AdminDeckResponse> getAllDecks() {
        return deckRepository.findAll().stream()
                .map(d -> new AdminDeckResponse(
                        d.getId(),
                        d.getTitle(),
                        d.getDescription(),
                        d.getUser() != null ? d.getUser().getId() : null,
                        d.getUser() != null ? d.getUser().getUsername() : null,
                        d.getFlashcards() != null ? d.getFlashcards().size() : 0,
                        d.isPublicDeck(),
                        d.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Get decks for a specific user.
     */
    @Transactional(readOnly = true)
    public List<AdminDeckResponse> getDecksForUser(Long userId) {
        return deckRepository.findByUser_Id(userId).stream()
                .map(d -> new AdminDeckResponse(
                        d.getId(),
                        d.getTitle(),
                        d.getDescription(),
                        d.getUser() != null ? d.getUser().getId() : null,
                        d.getUser() != null ? d.getUser().getUsername() : null,
                        d.getFlashcards() != null ? d.getFlashcards().size() : 0,
                        d.isPublicDeck(),
                        d.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Get all flashcards for a specific deck belonging to a user.
     * Validates that the deck actually belongs to the user.
     */
    @Transactional(readOnly = true)
    public List<FlashcardResponse> getFlashcardsForUserDeck(Long userId, Long deckId) {
        return deckRepository.findById(deckId)
                .filter(deck -> deck.getUser() != null && deck.getUser().getId().equals(userId))
                .map(deck -> deck.getFlashcards().stream()
                        .map(f -> new FlashcardResponse(
                                f.getId(),
                                f.getQuestion(),
                                f.getAnswer(),
                                f.getHint()
                        ))
                        .collect(Collectors.toList()))
                .orElse(List.of());  // Return empty list if deck not found or doesn't belong to user
    }
}

