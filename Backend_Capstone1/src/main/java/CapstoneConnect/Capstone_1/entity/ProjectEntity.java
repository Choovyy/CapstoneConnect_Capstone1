package CapstoneConnect.Capstone_1.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class ProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    private List<String> rolesNeeded;

    @ElementCollection
    private List<String> skillsRequired;

    @ElementCollection
    private List<String> projectInterests;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "project-user")
    private UserEntity user;

    @ManyToMany
    @JoinTable(
            name = "project_applicants",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore // Prevent serialization issues
    private List<UserEntity> applicants = new ArrayList<>();

    public ProjectEntity() {}

    public ProjectEntity(Long id, String name, String description, List<String> rolesNeeded,
                         List<String> skillsRequired, List<String> projectInterests, UserEntity user) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.rolesNeeded = rolesNeeded;
        this.skillsRequired = skillsRequired;
        this.projectInterests = projectInterests;
        this.user = user;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getRolesNeeded() {
        return rolesNeeded;
    }

    public void setRolesNeeded(List<String> rolesNeeded) {
        this.rolesNeeded = rolesNeeded;
    }

    public List<String> getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(List<String> skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public List<String> getProjectInterests() {
        return projectInterests;
    }

    public void setProjectInterests(List<String> projectInterests) {
        this.projectInterests = projectInterests;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
    public List<UserEntity> getApplicants() {
        return applicants; }

    public void setApplicants(List<UserEntity> applicants) {
        this.applicants = applicants; }
}

