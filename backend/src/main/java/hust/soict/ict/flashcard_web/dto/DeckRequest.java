package hust.soict.ict.flashcard_web.dto;

import java.util.List;

import jakarta.validation.Valid;
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
public class DeckRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private boolean publicDeck;
    
    @Size(min = 2, message = "At least 2 flashcards are required to create a deck")
    @Valid
    private List<FlashcardRequest> flashcards;
}