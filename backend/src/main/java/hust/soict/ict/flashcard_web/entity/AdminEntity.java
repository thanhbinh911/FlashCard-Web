package hust.soict.ict.flashcard_web.entity;


import jakarta.persistence.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "admins")
public class AdminEntity {
    @Id
    @Column(name = "admin_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private UserEntity user;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "permissions", nullable = false)
    private JsonNode permissions;


    public AdminEntity() {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public UserEntity getUser() {
        return user;
    }
    public void setUser(UserEntity user) {
        this.user = user;
    }
    public JsonNode getPermissions() {
        return permissions;
    }
    public void setPermissions(JsonNode permissions) {
        this.permissions = permissions;
    }
}
