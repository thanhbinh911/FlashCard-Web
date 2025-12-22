package hust.soict.ict.flashcard_web.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "user_profiles")
public class UserProfileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_picture_url", length = 255)
    private  String avatarUrl;
}
