package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class ReportEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reported_by", referencedColumnName = "user_id", nullable = false)
    private UserEntity reportedByUser;

    @ManyToOne
    @JoinColumn(name = "reported_deck_id", referencedColumnName = "deck_id", nullable = false)
    private DeckEntity reportedDeck;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public ReportEntity() {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public UserEntity getReportedByUser() {
        return reportedByUser;
    }
    public void setReportedByUser(UserEntity reportedByUser) {
        this.reportedByUser = reportedByUser;
    }
    public DeckEntity getReportedDeck() {
        return reportedDeck;
    }
    public void setReportedDeck(DeckEntity reportedDeck) {
        this.reportedDeck = reportedDeck;
    }
    public String getReason() {
        return reason;
    }
    public void setReason(String reason) {
        this.reason = reason;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


}
