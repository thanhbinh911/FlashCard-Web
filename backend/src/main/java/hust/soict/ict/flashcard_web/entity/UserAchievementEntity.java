package hust.soict.ict.flashcard_web.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "user_achievements")
public class UserAchievementEntity {
    @EmbeddedId
    @AttributeOverrides(
            {
             @AttributeOverride(name = "userId", column = @Column(name = "user_id")),
                    @AttributeOverride(name = "achievementId", column = @Column(name = "achievement_id"))
            }
    )
    private UserAchievementId id = new UserAchievementId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @MapsId("achievementId")
    @JoinColumn(name = "achievement_id")
    private AchievementEntity achievement;

    public UserAchievementEntity() {
    }

    public UserAchievementEntity(UserEntity user, AchievementEntity achievement) {
        this.user = user;
        this.achievement = achievement;
        Long userId = (user != null) ? user.getId() : null;
        Long achievementId = (achievement != null) ? achievement.getId() : null;
        this.id = new UserAchievementId(userId, achievementId);
    }

    public UserAchievementId getId() {
        return id;
    }
    public void setId(UserAchievementId id) {
        this.id = id;
    }
    public UserEntity getUser() {
        return user;
    }
    public void setUser(UserEntity user) {
        this.user = user;
        if (user != null) {
                        Long userId = user.getId();
            if (userId != null) {
                this.id.setUserId(userId);
            }
        }
    }
    public AchievementEntity getAchievement() {
        return achievement;
    }
    public void setAchievement(AchievementEntity achievement) {
        this.achievement = achievement;
        if (achievement != null) {
                        Long achievementId = achievement.getId();
            if (achievementId != null) {
                this.id.setAchievementId(achievementId);
            }
        }
    }
}
