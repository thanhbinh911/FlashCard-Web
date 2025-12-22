package hust.soict.ict.flashcard_web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardRequest {

    @NotBlank(message = "Question is required")
    @Size(max = 5000, message = "Question must be less than 5000 characters")
    private String questionText;

    @NotBlank(message = "Answer is required")
    @Size(max = 5000, message = "Answer must be less than 5000 characters")
    private String answerText;

    @Size(max = 1000, message = "Hint must be less than 1000 characters")
    private String hint;
}