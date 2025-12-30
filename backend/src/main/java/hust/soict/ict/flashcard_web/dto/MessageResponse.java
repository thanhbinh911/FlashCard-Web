package hust.soict.ict.flashcard_web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Standard response DTO for simple message responses (e.g., delete operations).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
}
