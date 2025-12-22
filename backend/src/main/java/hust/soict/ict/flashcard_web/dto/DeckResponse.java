package hust.soict.ict.flashcard_web.dto;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class DeckResponse {
    private Long id;
    private String title;
    private String description;
    @Setter(AccessLevel.NONE)
    private String createdAt;
}