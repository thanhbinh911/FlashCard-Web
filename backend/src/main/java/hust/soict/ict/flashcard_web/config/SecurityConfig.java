package hust.soict.ict.flashcard_web.config;

import hust.soict.ict.flashcard_web.security.JwtAuthenticationFilter; 
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; 

import org.springframework.security.config.Customizer;


/**
 * This class configures the security settings for the application, including authentication and authorization.
 * It enables web security and defines rules for accessing different parts of the application.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Exposes the AuthenticationManager as a bean.
     * The AuthenticationManager is responsible for authenticating users.
     *
     * @param config the authentication configuration
     * @return the AuthenticationManager
     * @throws Exception if an error occurs while getting the AuthenticationManager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Configures the security filter chain that applies to all HTTP requests.
     * This method defines which endpoints are public and which require authentication.
     *
     * @param http the HttpSecurity object to configure
     * @return the configured SecurityFilterChain
     * @throws Exception if an error occurs during configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (Cross-Site Request Forgery) protection, as we are using JWTs for session management
                .csrf(csrf -> csrf.disable())

                // Enable CORS (Cross-Origin Resource Sharing) with default settings.
                // This will use the `corsConfigurationSource` bean defined in `ApplicationConfig`.
                .cors(Customizer.withDefaults())

                // Configure authorization rules for HTTP requests
                .authorizeHttpRequests(authorize -> authorize
                        // Allow all requests to endpoints under "/api/auth/" (e.g., login, register)
                        .requestMatchers("/api/auth/**").permitAll()
                        // Require authentication for any other request
                        .anyRequest().authenticated()
                )
                // Configure session management to be stateless
                // This means the server will not create or maintain any HTTP session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Add the custom JWT authentication filter before the standard username/password authentication filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Build and return the configured SecurityFilterChain
        return http.build();
    }

    

}