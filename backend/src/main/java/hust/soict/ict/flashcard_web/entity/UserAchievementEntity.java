package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_achievements")
public class UserAchievementEntity {

    @EmbeddedId
    @AttributeOverrides({
        @AttributeOverride(name = "userId", column = @Column(name = "user_id")),
        @AttributeOverride(name = "achievementId", column = @Column(name = "achievement_id"))
    })
    private UserAchievementId id = new UserAchievementId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @MapsId("achievementId")
    @JoinColumn(name = "achievement_id")
    private AchievementEntity achievement;

}
