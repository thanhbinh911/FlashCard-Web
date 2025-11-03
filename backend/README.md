# Flashcard Web Application – Authentication & Request Flow

This document explains how the **Spring Boot Flashcard Web Application** initializes, handles authentication, and processes both **public** and **protected** API requests. It covers how configuration, security filters, and request flows interact from startup to response.

---

## 1. Application Startup & Initial Configuration

When you run the `FlashcardWebApplication.java` file, Spring Boot performs the following steps:

### **1. Component Scanning**
Spring scans all classes annotated with:
- `@Component`
- `@Service`
- `@Repository`
- `@RestController`
- `@Configuration`

and registers them as beans in the **Application Context**.

---

### **2. Configuration Loading**

#### **ApplicationConfig.java**
- Defines a `PasswordEncoder` bean using `BCryptPasswordEncoder`.
- Makes it available throughout the application for password encryption and validation.

#### **SecurityConfig.java**
- Core security configuration class.
- Defines a `SecurityFilterChain` bean, which determines how requests are secured and filtered.

Key configuration details:
```java
csrf(csrf -> csrf.disable());
sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .anyRequest().authenticated()
);
addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
```

**Explanation:**
- **`csrf.disable()`** → Disables CSRF protection (typical for stateless REST APIs).
- **`SessionCreationPolicy.STATELESS`** → Spring will **not** create or use `HttpSession`; each request must authenticate via JWT.
- **`requestMatchers("/api/auth/**").permitAll()`** → Allows unauthenticated access to authentication endpoints (e.g., login, register).
- **`anyRequest().authenticated()`** → Requires authentication for all other endpoints.
- **`addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)`** → Inserts the custom JWT filter **before** Spring’s default authentication filter.

---

### **3. Database Configuration**
Spring reads `application.properties` for:
- **Database connection** (`spring.datasource.*` → PostgreSQL)
- **JPA/Hibernate** configuration (`spring.jpa.*`, e.g., `ddl-auto=update`, `dialect`)

---

## 2. Request Flow A – Public Endpoint (`POST /api/auth/login`)

### **Step-by-Step**

1. **HTTP Request**
   - The frontend sends a `POST` request to `/api/auth/login` with JSON body:
     ```json
     { "email": "user@example.com", "password": "123456" }
     ```

2. **Security Filter Chain**
   - The request enters the security filter chain.

3. **JwtAuthenticationFilter**
   - Checks `Authorization` header.
   - Since this is a login request, the header is missing or doesn’t start with `"Bearer "`.
   - Condition:
     ```java
     if (authHeader == null || !authHeader.startsWith("Bearer "))
     ```
     is `true`, so the filter calls `filterChain.doFilter(request, response)` to continue processing.

4. **Spring Authorization**
   - Spring Security sees the URL `/api/auth/login`.
   - According to configuration, `.requestMatchers("/api/auth/**").permitAll()`, the request is allowed to pass through **without authentication**.

5. **Controller Layer (`AuthController`)**
   - The request is routed to `AuthController`.
   - JSON is deserialized into a `LoginRequest` DTO (`@RequestBody LoginRequest request`).
   - The `login()` method is executed.

6. **AuthenticationManager**
   - `authenticationManager.authenticate(...)` is called.
   - This triggers:
     - `UserDetailsService.loadUserByUsername(request.getEmail())` (implemented in `UserService`).
     - `UserRepository` fetches `UserEntity` from DB.
     - Passwords are compared using the injected `PasswordEncoder` bean.

7. **Response Generation**
   - If successful, `jwtService.generateToken(userDetails)` creates a new JWT.
   - The controller returns an `AuthResponse` DTO containing the token:
     ```json
     { "token": "<jwt_token>" }
     ```

---

## 3. Request Flow B – Protected Endpoint (`POST /api/decks`)

### **Step-by-Step**

1. **HTTP Request**
   - Frontend sends:
     ```
     POST /api/decks
     Authorization: Bearer <jwt_token>
     Content-Type: application/json
     ```
     with body:
     ```json
     { "title": "My Deck", "description": "Study cards" }
     ```

2. **Security Filter Chain**
   - The request enters the security filter chain again.

3. **JwtAuthenticationFilter**
   - Reads `Authorization` header.
   - Extracts token:
     ```java
     final String jwt = authHeader.substring(7);
     ```
   - Extracts username (email):
     ```java
     jwtService.extractUsername(jwt);
     ```
   - If username exists and `SecurityContextHolder` has no authentication:
     - Loads user details from DB (`userDetailsService.loadUserByUsername()`).
     - Validates token (`jwtService.isTokenValid(jwt, userDetails)`).
   - If valid:
     - Creates an `UsernamePasswordAuthenticationToken` with user details.
     - Sets authentication:
       ```java
       SecurityContextHolder.getContext().setAuthentication(authToken);
       ```
   - Calls `filterChain.doFilter(request, response)` to continue.

4. **Spring Authorization**
   - URL `/api/decks` → matches `.anyRequest().authenticated()`.
   - Since authentication is now present, request proceeds.

5. **Controller Layer (`DeckController`)**
   - JSON is deserialized into `DeckRequest` DTO.
   - Calls `deckService.createDeck(request)`.

6. **Service Layer (`DeckService`)**
   - Retrieves current user:
     ```java
     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
     ```
   - Loads the corresponding `UserEntity` from DB.
   - Creates a new `DeckEntity`:
     ```java
     newDeck.setTitle(request.getTitle());
     newDeck.setDescription(request.getDescription());
     newDeck.setUser(currentUser);
     ```

7. **Repository Layer (`DeckRepository`)**
   - Calls `deckRepository.save(newDeck)`.
   - Spring Data JPA automatically generates and executes the SQL `INSERT`.

8. **Response Generation**
   - `DeckService` maps `DeckEntity` → `DeckResponse` DTO.
   - `DeckController` returns:
     ```json
     { "id": 1, "title": "My Deck", "description": "Study cards" }
     ```
   - Status: `200 OK`.

---

### Notes
- The app uses **stateless authentication** (JWT).
- Every request must include a valid token except `/api/auth/**`.
- `SecurityContextHolder` stores the authentication info for each request lifecycle.

---

### Example JWT Flow

```text
[Frontend] → /api/auth/login → [AuthController]
              ↓
         [JWT generated]
              ↓
[Frontend] stores token (localStorage)
              ↓
[Frontend] → /api/decks (with Authorization: Bearer <token>)
              ↓
        [JwtAuthenticationFilter]
              ↓
       [DeckController] → [DeckService] → [DB]
```

---


