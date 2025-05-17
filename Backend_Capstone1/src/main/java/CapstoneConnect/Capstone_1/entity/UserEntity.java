package CapstoneConnect.Capstone_1.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

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


    @OneToOne(mappedBy = "user")
    @JsonManagedReference(value = "profile-user")
    private ProfileEntity profile;

    @OneToMany(mappedBy = "user")
    @JsonManagedReference(value = "project-user")
    private List<ProjectEntity> projects;

    @ManyToMany(mappedBy = "applicants")
    @JsonBackReference(value = "project-applicants")
    private List<ProjectEntity> appliedProjects;


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

    public ProfileEntity getProfile() {
        return profile;
    }

    public void setProfile(ProfileEntity profile) {
        this.profile = profile;
    }


    public List<ProjectEntity> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectEntity> projects) {
        this.projects = projects;
    }

    public List<ProjectEntity> getAppliedProjects() {
        return appliedProjects; }
    public void setAppliedProjects(List<ProjectEntity> appliedProjects) {
        this.appliedProjects = appliedProjects; }
}
