package hust.soict.ict.flashcard_web.repository.exception;

public class AuthenticationRequiredException extends  RuntimeException{
    public AuthenticationRequiredException(String message) {
        super(message);
    }
}
