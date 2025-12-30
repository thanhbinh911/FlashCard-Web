package hust.soict.ict.flashcard_web.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class AuthResponse {
    private String token;
    private String username;
}