package hust.soict.ict.flashcard_web.service;


import hust.soict.ict.flashcard_web.dto.RegisterRequest;
import hust.soict.ict.flashcard_web.entity.UserEntity;
import hust.soict.ict.flashcard_web.repository.UserRepository;
import hust.soict.ict.flashcard_web.security.CustomUserDetails; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails; 
import org.springframework.security.core.userdetails.UserDetailsService; 
import org.springframework.security.core.userdetails.UsernameNotFoundException; 
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * This service class implements the `UserDetailsService` interface to handle user-related operations,
 * including loading user details for authentication and registering new users.
 */
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Loads a user's details by their email address.
     * This method is used by Spring Security for authentication.
     *
     * @param email the email address of the user to load.
     * @return a `UserDetails` object containing the user's information.
     * @throws UsernameNotFoundException if no user is found with the given email.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new CustomUserDetails(user);
    }

    /**
     * Registers a new user in the system.
     * It checks if the email is already in use, encodes the password, and saves the new user.
     *
     * @param request the `RegisterRequest` object containing the new user's information.
     * @return a `UserDetails` object for the newly registered user.
     * @throws RuntimeException if the email is already registered.
     */
    public UserDetails registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        UserEntity newUser = new UserEntity();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        UserEntity savedUser = userRepository.save(newUser);

        return new CustomUserDetails(savedUser);
    }
}