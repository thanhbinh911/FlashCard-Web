package hust.soict.ict.flashcard_web.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Request to save session progress (remaining time).
 */
@Getter
@Setter
public class SaveProgressRequest {
    private Long remainingSeconds;
}
