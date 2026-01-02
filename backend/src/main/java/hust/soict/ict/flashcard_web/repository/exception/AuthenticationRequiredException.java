package hust.soict.ict.flashcard_web.exception;

public class AuthenticationRequiredException extends  RuntimeException{
    public AuthenticationRequiredException(String message) {
        super(message);
    }
}
