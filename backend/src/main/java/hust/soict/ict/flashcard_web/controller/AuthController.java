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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        
        UserDetails userDetails = userService.registerUser(request);
        String token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        UserDetails userDetails = (UserDetails) authentication.getPrincipal();


        String token = jwtService.generateToken(userDetails);


        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername()));
    }
}