package hust.soict.ict.flashcard_web.entity;

import java.io.Serializable;
import java.util.Objects;
import jakarta.persistence.*;

@Embeddable
public class UserAchievementId implements Serializable {
    private Long userId;
    private Long achievementId;

    public UserAchievementId() {
    }

    public UserAchievementId(Long userId, Long achievementId) {
        this.userId = userId;
        this.achievementId = achievementId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getAchievementId() {
        return achievementId;
    }
    public void setAchievementId(Long achievementId) {
        this.achievementId = achievementId;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o)
            return true;
        if (o == null || this.getClass() != o.getClass())
            return false;
        UserAchievementId that = (UserAchievementId) o;
        return Objects.equals(userId, that.userId) && java.util.Objects.equals(achievementId, that.achievementId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, achievementId);
    }

}
