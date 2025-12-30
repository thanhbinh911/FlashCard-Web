package hust.soict.ict.flashcard_web.entity;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UserAchievementId implements Serializable {
    private Long userId;
    private Long achievementId;


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
