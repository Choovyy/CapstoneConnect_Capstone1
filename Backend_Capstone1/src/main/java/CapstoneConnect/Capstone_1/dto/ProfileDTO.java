package CapstoneConnect.Capstone_1.dto;

import java.util.List;

public class ProfileDTO {

    private Long id;
    private Long userId; // ✅ Add this field
    private String name;
    private String email;
    private String profilePicture;
    private List<String> technicalSkills;
    private List<String> projectInterests;
    private List<String> preferredRoles;

    public ProfileDTO() {}

    public ProfileDTO(Long id, Long userId, String name, String email, String profilePicture, List<String> technicalSkills,
                      List<String> projectInterests, List<String> preferredRoles) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
        this.technicalSkills = technicalSkills;
        this.projectInterests = projectInterests;
        this.preferredRoles = preferredRoles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public List<String> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<String> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<String> getProjectInterests() {
        return projectInterests;
    }

    public void setProjectInterests(List<String> projectInterests) {
        this.projectInterests = projectInterests;
    }

    public List<String> getPreferredRoles() {
        return preferredRoles;
    }

    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = preferredRoles;
    }
}
