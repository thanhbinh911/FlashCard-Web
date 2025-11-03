package hust.soict.ict.flashcard_web.security;

import hust.soict.ict.flashcard_web.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * A custom implementation of Spring Security's `UserDetails` interface.
 * This class wraps a `UserEntity` object to provide user details that Spring Security
 * can use for authentication and authorization purposes.
 */
public class CustomUserDetails implements UserDetails {

    private final UserEntity userEntity;

    /**
     * Constructs a `CustomUserDetails` instance with the given `UserEntity`.
     *
     * @param userEntity The user entity from the database.
     */
    public CustomUserDetails(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    /**
     * Returns the authorities granted to the user.
     * In this implementation, no specific authorities (roles) are assigned, so it returns an empty list.
     *
     * @return A collection of granted authorities.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For now, we are not using roles, so this returns an empty list.
        // If you add roles (e.g., ROLE_USER, ROLE_ADMIN), you would map them here.
        return Collections.emptyList();
    }

    /**
     * Returns the password used to authenticate the user.
     *
     * @return The user's encoded password.
     */
    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    /**
     * Returns the username used to authenticate the user. In this application, the email is used as the username.
     *
     * @return The user's email address.
     */
    @Override
    public String getUsername() {
        return userEntity.getEmail();
    }

    /**
     * Indicates whether the user's account has expired.
     * An expired account cannot be authenticated.
     *
     * @return `true` if the user's account is valid (non-expired), `false` otherwise.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true; // Account never expires
    }

    /**
     * Indicates whether the user is locked or unlocked.
     * A locked user cannot be authenticated.
     *
     * @return `true` if the user is not locked, `false` otherwise.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true; // Account is never locked
    }

    /**
     * Indicates whether the user's credentials (password) has expired.
     * Expired credentials prevent authentication.
     *
     * @return `true` if the user's credentials are valid (non-expired), `false` otherwise.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials never expire
    }

    /**
     * Indicates whether the user is enabled or disabled.
     * A disabled user cannot be authenticated.
     *
     * @return `true` if the user is enabled, `false` otherwise.
     */
    @Override
    public boolean isEnabled() {
        return true; // Account is always enabled
    }
}