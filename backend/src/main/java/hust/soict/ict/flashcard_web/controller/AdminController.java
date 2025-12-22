package hust.soict.ict.flashcard_web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hust.soict.ict.flashcard_web.dto.AdminDashboardResponse;
import hust.soict.ict.flashcard_web.dto.AdminDeckResponse;
import hust.soict.ict.flashcard_web.dto.AdminUserResponse;
import hust.soict.ict.flashcard_web.dto.FlashcardResponse;
import hust.soict.ict.flashcard_web.service.AdminService;

/**
 * Admin-only endpoints for dashboard and user/deck management.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Get dashboard statistics.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get all users.
     */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }



    /**
     * Get decks for a specific user.
     */
    @GetMapping("/users/{userId}/decks")
    public ResponseEntity<List<AdminDeckResponse>> getDecksForUser(@PathVariable Long userId) {
        List<AdminDeckResponse> decks = adminService.getDecksForUser(userId);
        return ResponseEntity.ok(decks);
    }

    /**
     * Get all flashcards for a specific deck belonging to a user.
     */
    @GetMapping("/users/{userId}/decks/{deckId}/flashcards")
    public ResponseEntity<List<FlashcardResponse>> getFlashcardsForUserDeck(
            @PathVariable Long userId,
            @PathVariable Long deckId) {
        List<FlashcardResponse> flashcards = adminService.getFlashcardsForUserDeck(userId, deckId);
        return ResponseEntity.ok(flashcards);
    }
}

