package hust.soict.ict.flashcard_web.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SessionResultResponse {
    private Long sessionId;
    private Integer correctCount;
    private Integer totalCards;
    private LocalDateTime finishedAt;
}
