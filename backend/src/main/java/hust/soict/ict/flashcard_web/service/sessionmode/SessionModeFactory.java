package hust.soict.ict.flashcard_web.service.sessionmode;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

/**
 * Factory for creating SessionMode instances based on mode name.
 * Uses Spring's dependency injection to get all available modes.
 */
@Component
public class SessionModeFactory {
    
    private final Map<String, SessionMode> modeMap = new HashMap<>();
    private final SessionMode defaultMode;
    
    /**
     * Constructor that automatically collects all SessionMode implementations.
     * Spring injects all beans that implement SessionMode interface.
     */
    public SessionModeFactory(List<SessionMode> modes) {
        for (SessionMode mode : modes) {
            modeMap.put(mode.getModeName().toUpperCase(), mode);
        }
        
        // Default to REGULAR mode
        this.defaultMode = modeMap.getOrDefault(
                RegularSessionMode.MODE_NAME, 
                modes.isEmpty() ? null : modes.get(0)
        );
    }
    
    /**
     * Get a SessionMode by name.
     * 
     * @param modeName Mode name (REGULAR, MCQ, REVIEW)
     * @return The corresponding SessionMode, or default if not found
     */
    public SessionMode getMode(String modeName) {
        if (modeName == null || modeName.isBlank()) {
            return defaultMode;
        }
        return modeMap.getOrDefault(modeName.toUpperCase(), defaultMode);
    }
    
    /**
     * Get the default session mode (REGULAR).
     */
    public SessionMode getDefaultMode() {
        return defaultMode;
    }
    
    /**
     * Check if a mode name is valid.
     */
    public boolean isValidMode(String modeName) {
        return modeName != null && modeMap.containsKey(modeName.toUpperCase());
    }
    
    /**
     * Get all available mode names.
     */
    public List<String> getAvailableModes() {
        return List.copyOf(modeMap.keySet());
    }
}
