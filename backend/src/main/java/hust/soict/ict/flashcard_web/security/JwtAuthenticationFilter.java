package hust.soict.ict.flashcard_web.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * A filter that intercepts incoming HTTP requests to authenticate users based on a JWT.
 * This filter extends `OncePerRequestFilter` to ensure it is executed only once per request.
 * It extracts the JWT from the "Authorization" header, validates it, and sets the user's
 * authentication details in the `SecurityContextHolder` if the token is valid.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    /**
     * This method is called for each incoming request to perform JWT-based authentication.
     *
     * @param request     The incoming HTTP request.
     * @param response    The HTTP response.
     * @param filterChain The filter chain to pass the request along.
     * @throws ServletException If a servlet-related error occurs.
     * @throws IOException      If an I/O error occurs.
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Extract the "Authorization" header from the request.
        final String authHeader = request.getHeader("Authorization");

        // 2. If the header is missing or doesn't start with "Bearer ", pass the request to the next filter.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the JWT from the header (it's the part after "Bearer ").
        final String jwt = authHeader.substring(7);

        // 4. Extract the user's email (which is used as the username) from the JWT.
        final String userEmail = jwtService.extractUsername(jwt);

        // 5. If the email is extracted and there is no existing authentication in the security context.
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Load user details from the database using the email.
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 6. If the token is valid for the loaded user details.
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Create an authentication token for the user.
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // Credentials are not needed as the user is already authenticated by the token.
                        userDetails.getAuthorities()
                );

                // Set additional details for the authentication token from the request.
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 7. Set the authentication token in the SecurityContextHolder.
                // This marks the current user as authenticated for this request.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 8. Continue the filter chain, passing the request and response to the next filter.
        filterChain.doFilter(request, response);
    }
}