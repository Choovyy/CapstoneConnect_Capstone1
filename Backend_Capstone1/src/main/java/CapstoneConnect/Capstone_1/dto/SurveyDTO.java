package CapstoneConnect.Capstone_1.dto;

import java.util.List;

public class SurveyDTO {

    private Long id;
    private List<String> technicalSkills;
    private List<String> projectInterests;
    private List<String> preferredRoles;
    private String personality;    public SurveyDTO() {}

    public SurveyDTO(Long id, List<String> technicalSkills, List<String> projectInterests, List<String> preferredRoles, String personality) {
        this.id = id;
        this.technicalSkills = technicalSkills;
        this.projectInterests = projectInterests;
        this.preferredRoles = preferredRoles;
        this.personality = personality;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
    }    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = preferredRoles;
    }    public String getPersonality() {
        return personality != null ? personality : "Unknown";
    }

    public void setPersonality(String personality) {
        this.personality = personality != null && !personality.trim().isEmpty() ? personality : "Unknown";
    }
}
