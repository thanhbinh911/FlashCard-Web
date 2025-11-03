package hust.soict.ict.flashcard_web.dto;

/**
 * Represents the data transfer object (DTO) for a deck response.
 * This class is used to send deck information to the client, containing details
 * such as the deck's ID, title, description, and creation date.
 */
public class DeckResponse {
    
    private Long id;

    private String title;

    private String description;

    private String createdAt;

    /**
     * Constructs a new `DeckResponse` with the specified details.
     *
     * @param id          The unique identifier of the deck.
     * @param title       The title of the deck.
     * @param description A description of the deck.
     * @param createdAt   The creation timestamp, formatted as a string.
     */
    public DeckResponse(Long id, String title, String description, String createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}