package hust.soict.ict.flashcard_web.controller;

import hust.soict.ict.flashcard_web.dto.AuthResponse;
import hust.soict.ict.flashcard_web.dto.LoginRequest;
import hust.soict.ict.flashcard_web.dto.RegisterRequest;
import hust.soict.ict.flashcard_web.security.JwtService; 
import hust.soict.ict.flashcard_web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; 
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; 
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * This controller handles authentication-related requests, such as user registration and login.
 * It provides endpoints for users to create an account and obtain a JWT for accessing protected resources.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    /**
     * Handles the user registration request.
     * When a user signs up, this method creates a new user account and returns a JWT.
     *
     * @param request The registration request containing user details (username, email, password, etc.).
     * @return A `ResponseEntity` containing an `AuthResponse` with the JWT and username.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Register the new user using the UserService
        UserDetails userDetails = userService.registerUser(request);
        // Generate a JWT for the newly registered user
        String token = jwtService.generateToken(userDetails);
        // Return the token and username in the response
        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername()));
    }

    /**
     * Handles the user login request.
     * It authenticates the user's credentials and, if successful, returns a JWT.
     *
     * @param request The login request containing the user's email and password.
     * @return A `ResponseEntity` containing an `AuthResponse` with the JWT and username.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Authenticate the user's credentials using the AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Get the UserDetails from the authenticated principal
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate a JWT for the authenticated user
        String token = jwtService.generateToken(userDetails);

        // Return the token and username in the response
        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername()));
    }
}