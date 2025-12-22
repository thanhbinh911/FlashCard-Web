package hust.soict.ict.flashcard_web.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Admin dashboard statistics response.
 */
@AllArgsConstructor
@Getter
public class AdminDashboardResponse {
    private Long totalUsers;
    private Long totalDecks;
    private Long totalFlashcards;
    private Long totalStudySessions;
    private Long activeSessionsCount;
    private List<RecentUserActivity> recentActivity;

    @AllArgsConstructor
    @Getter
    public static class RecentUserActivity {
        private Long userId;
        private String username;
        private String email;
        private LocalDateTime lastLogin;
        private Integer deckCount;
        private Integer sessionCount;
    }
}
