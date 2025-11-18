package hust.soict.ict.flashcard_web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

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

    /**
     * Configures Cross-Origin Resource Sharing (CORS) for the application.
     * This allows web applications from any origin to make requests to the backend API.
     *
     * @return a CorsConfigurationSource instance.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow all origins, methods, and headers. This is a permissive configuration.
        // For production, it's recommended to restrict origins to specific domains.
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        // Allow credentials (like cookies and authentication headers) to be sent
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this CORS configuration to all paths in the application
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }

}