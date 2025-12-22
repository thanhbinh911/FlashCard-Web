package hust.soict.ict.flashcard_web.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Detailed summary of a completed study session.
 * Includes per-question stats for review.
 */
@AllArgsConstructor
@Getter
@Setter
public class SessionSummaryResponse {
    private Long sessionId;
    private Long deckId;
    private String deckTitle;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Integer totalCards;
    private Integer correctCount;
    private Boolean isPracticeMode;
    private List<QuestionSummary> questions;

    @AllArgsConstructor
    @Getter
    public static class QuestionSummary {
        private Long flashcardId;
        private Integer position;
        private String question;
        private String correctAnswer;
        private String userAnswer;
        private Boolean isCorrect;
    }
}
