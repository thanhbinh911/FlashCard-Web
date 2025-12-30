package hust.soict.ict.flashcard_web.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hust.soict.ict.flashcard_web.dto.AuthResponse;
import hust.soict.ict.flashcard_web.dto.ChangePasswordRequest;
import hust.soict.ict.flashcard_web.dto.LoginRequest;
import hust.soict.ict.flashcard_web.dto.MessageResponse;
import hust.soict.ict.flashcard_web.dto.RegisterRequest;
import hust.soict.ict.flashcard_web.security.CustomUserDetails;
import hust.soict.ict.flashcard_web.security.JwtService;
import hust.soict.ict.flashcard_web.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        CustomUserDetails userDetails = userService.registerUser(request);
        String token = generateTokenWithUserId(userDetails);
        return ResponseEntity.ok(new AuthResponse(token, userDetails.getActualUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        // Update last login timestamp
        userService.updateLastLogin(userDetails.getId());
        
        String token = generateTokenWithUserId(userDetails);
        return ResponseEntity.ok(new AuthResponse(token, userDetails.getActualUsername()));
    }

    @PutMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        userService.changePassword(userDetails.getId(), request);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    private String generateTokenWithUserId(CustomUserDetails userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", userDetails.getId());
        extraClaims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
        return jwtService.generateToken(extraClaims, userDetails);
    }
}