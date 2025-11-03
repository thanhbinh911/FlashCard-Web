package hust.soict.ict.flashcard_web.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * This service class is responsible for handling JSON Web Tokens (JWTs).
 * It provides methods for generating, validating, and extracting information from JWTs.
 */
@Service
public class JwtService {

    // A secure, Base64-encoded secret key for signing the JWTs.
    // This should be stored securely and not hard-coded in a real application.
    private static final String SECRET_KEY = "VGhpcyBJcyBBIEJlYXV0aWZ1bCBTZWNyZXQgS2V5IEZvciBKYXNvbiBXZWIgVG9rZW4gMjU2Yml0cw==";

    // The expiration time for the JWT, set to 24 hours in milliseconds.
    private static final long JWT_EXPIRATION_MS = 1000 * 60 * 60 * 24;

    /**
     * Extracts the username (subject) from a given JWT.
     *
     * @param token The JWT from which to extract the username.
     * @return The username (subject) contained in the token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * A generic method to extract a specific claim from a JWT.
     *
     * @param token          The JWT to parse.
     * @param claimsResolver A function to apply to the claims to extract the desired information.
     * @param <T>            The type of the claim to be returned.
     * @return The extracted claim.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generates a JWT for a given user without any extra claims.
     *
     * @param userDetails The user details for whom the token is to be generated.
     * @return A signed JWT string.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a JWT for a given user with additional claims.
     *
     * @param extraClaims A map of extra claims to include in the token's payload.
     * @param userDetails The user details for whom the token is to be generated.
     * @return A signed JWT string.
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername()) // The subject of the token is the user's email.
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(getSignInKey(), Jwts.SIG.HS256) // Sign the token with the HS256 algorithm.
                .compact();
    }

    /**
     * Validates a JWT.
     * It checks if the token's username matches the UserDetails' username and if the token has not expired.
     *
     * @param token       The JWT to validate.
     * @param userDetails The user details to validate against.
     * @return `true` if the token is valid, `false` otherwise.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Checks if a JWT has expired.
     *
     * @param token The JWT to check.
     * @return `true` if the token is expired, `false` otherwise.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extracts the expiration date from a JWT.
     *
     * @param token The JWT from which to extract the expiration date.
     * @return The expiration date.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts all claims from a JWT by parsing and verifying its signature.
     *
     * @param token The JWT to parse.
     * @return The claims (payload) of the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Generates the secret key used for signing and verifying JWTs.
     * It decodes the Base64-encoded secret key string.
     *
     * @return The `SecretKey` instance.
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}