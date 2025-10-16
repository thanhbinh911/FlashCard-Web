package hust.soict.ict.flashcard_web.service;

import hust.soict.ict.flashcard_web.dto.AuthResponse;
import hust.soict.ict.flashcard_web.dto.LoginRequest;
import hust.soict.ict.flashcard_web.dto.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public AuthResponse registerUser(RegisterRequest request) {
        System.out.println("Mock API: Đang xử lý đăng ký cho user: " + request.getUsername());
        return new AuthResponse("fake-jwt-token-for-registration", request.getUsername());
    }

    public AuthResponse loginUser(LoginRequest request) {
        System.out.println("Mock API: Đang xử lý đăng nhập cho email: " + request.getEmail());
        return new AuthResponse("fake-jwt-token-for-login", "user_from_db");
    }
}