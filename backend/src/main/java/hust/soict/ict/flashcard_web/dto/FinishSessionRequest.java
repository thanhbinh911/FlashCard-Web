package hust.soict.ict.flashcard_web.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * Request to finish a session with all answers submitted at once (batch submission).
 */
@Getter
@Setter
public class FinishSessionRequest {
    private List<AnswerItem> answers;

    @Getter
    @Setter
    public static class AnswerItem {
        private Long flashcardId;
        private String userAnswer;
    }
}
