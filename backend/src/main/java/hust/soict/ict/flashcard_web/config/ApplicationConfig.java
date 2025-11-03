package hust.soict.ict.flashcard_web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * This class provides application-level configuration.
 * It is used to define beans that can be managed by the Spring container.
 */
@Configuration
public class ApplicationConfig {

    /**
     * Creates a PasswordEncoder bean that uses the BCrypt hashing algorithm.
     * This bean is used throughout the application to encode and verify passwords.
     *
     * @return a PasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}