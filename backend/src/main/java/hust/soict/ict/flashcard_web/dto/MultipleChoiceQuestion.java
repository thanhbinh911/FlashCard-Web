package hust.soict.ict.flashcard_web.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Multiple choice question representation.
 * Used when starting a session in MCQ mode.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MultipleChoiceQuestion {
    private Long flashcardId;
    private int position;
    private String questionText;
    private String hint;
    private List<String> options;  // Shuffled options (correct + distractors)
    
    // Note: correctOptionIndex is NOT sent to frontend to prevent cheating
    // Backend stores the correct answer and validates on submission
}
