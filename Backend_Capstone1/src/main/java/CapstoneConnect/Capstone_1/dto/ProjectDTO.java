package CapstoneConnect.Capstone_1.dto;

import java.util.List;

public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> rolesNeeded;
    private List<String> skillsRequired;
    private List<String> projectInterests;
    private Long userId;
    private String username; // Optional for frontend display

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
