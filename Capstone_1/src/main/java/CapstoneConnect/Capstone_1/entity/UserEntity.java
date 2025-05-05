package CapstoneConnect.Capstone_1.entity;


import jakarta.persistence.*;
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String oauthId;

    // Flag to track if it's the user's first time
    @Column(nullable = false)
    private boolean firstTimeUser;

    public UserEntity() {
        // Default constructor
        this.firstTimeUser = true; // Assuming new users are first time by default
    }

    public UserEntity(String oauthId, String email, String name, boolean firstTimeUser) {
        this.oauthId = oauthId;
        this.email = email;
        this.name = name;
        this.firstTimeUser = firstTimeUser;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getOauthId() {
        return oauthId;
    }

    public void setOauthId(String oauthId) {
        this.oauthId = oauthId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isFirstTimeUser() {
        return firstTimeUser;
    }

    public void setFirstTimeUser(boolean firstTimeUser) {
        this.firstTimeUser = firstTimeUser;
    }
}
