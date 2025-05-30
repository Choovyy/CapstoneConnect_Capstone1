package CapstoneConnect.Capstone_1.dto;

import java.util.List;

public class MatchResultDTO {
    private String name;
    private List<String> technicalSkills;
    private List<String> preferredRoles;
    private List<String> projectInterests;
    private String personality;    
    private double overallScore;  // compatibility score
    private double skillScore;    // score based on technical skills
    private double personalityScore; // score based on personality
    private double projectInterestScore; // score based on matching project interests
    private double preferredRolesScore; // score based on matching preferred roles
    private String profilePicture; // URL of the user's profile picture

    public MatchResultDTO() {}    
    
    public MatchResultDTO(String name, List<String> technicalSkills, List<String> preferredRoles,
                      List<String> projectInterests, String personality, double overallScore, 
                      double skillScore, double personalityScore, double projectInterestScore, 
                      double preferredRolesScore, String profilePicture) {
        this.name = name;
        this.technicalSkills = technicalSkills;
        this.preferredRoles = preferredRoles;
        this.projectInterests = projectInterests;        
        this.personality = personality;
        this.overallScore = overallScore;
        this.skillScore = skillScore;
        this.personalityScore = personalityScore;
        this.projectInterestScore = projectInterestScore;
        this.preferredRolesScore = preferredRolesScore;
        this.profilePicture = profilePicture;
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

    public String getPersonality() {
        return personality;
    }

    public void setPersonality(String personality) {
        this.personality = personality;
    }

    public double getOverallScore() {
        return overallScore;
    }    public void setOverallScore(double overallScore) {
        this.overallScore = overallScore;
    }
    
    public double getSkillScore() {
        return skillScore;
    }

    public void setSkillScore(double skillScore) {
        this.skillScore = skillScore;
    }

    public double getPersonalityScore() {
        return personalityScore;
    }    public void setPersonalityScore(double personalityScore) {
        this.personalityScore = personalityScore;
    }
    
    public double getProjectInterestScore() {
        return projectInterestScore;
    }    public void setProjectInterestScore(double projectInterestScore) {
        this.projectInterestScore = projectInterestScore;
    }
    
    public double getPreferredRolesScore() {
        return preferredRolesScore;
    }

    public void setPreferredRolesScore(double preferredRolesScore) {
        this.preferredRolesScore = preferredRolesScore;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
