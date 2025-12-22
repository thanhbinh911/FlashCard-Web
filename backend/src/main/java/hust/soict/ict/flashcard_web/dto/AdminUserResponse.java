package hust.soict.ict.flashcard_web.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * User details for admin view.
 */
@AllArgsConstructor
@Getter
public class AdminUserResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private LocalDateTime lastLogin;
    private Integer deckCount;
    private Integer totalStudySessions;
}
