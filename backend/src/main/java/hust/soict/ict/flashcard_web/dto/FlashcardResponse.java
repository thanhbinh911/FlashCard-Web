package hust.soict.ict.flashcard_web.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FlashcardResponse {
    private Long id;
    private String questionText;
    private String answerText;
    private String hint;
}