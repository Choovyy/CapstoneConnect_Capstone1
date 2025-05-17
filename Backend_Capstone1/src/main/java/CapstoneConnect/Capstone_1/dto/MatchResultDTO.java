package CapstoneConnect.Capstone_1.dto;

import java.util.List;

public class MatchResultDTO {
    private String name;
    private List<String> technicalSkills;
    private List<String> preferredRoles;
    private List<String> projectInterests;
    private double score;  // compatibility score

    public MatchResultDTO() {}

    public MatchResultDTO(String name, List<String> technicalSkills, List<String> preferredRoles, List<String> projectInterests, double score) {
        this.name = name;
        this.technicalSkills = technicalSkills;
        this.preferredRoles = preferredRoles;
        this.projectInterests = projectInterests;
        this.score = score;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<String> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<String> getPreferredRoles() {
        return preferredRoles;
    }

    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = preferredRoles;
    }

    public List<String> getProjectInterests() {
        return projectInterests;
    }

    public void setProjectInterests(List<String> projectInterests) {
        this.projectInterests = projectInterests;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
