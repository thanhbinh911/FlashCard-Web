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

@Service
public class UserService implements UserDetailsService { 

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));
        return new CustomUserDetails(user);
    }

    public UserDetails registerUser(RegisterRequest request) {
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
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