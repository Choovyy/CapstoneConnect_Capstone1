package CapstoneConnect.Capstone_1.dto;

import CapstoneConnect.Capstone_1.entity.RequestEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;

public class SentRequestDTO {
    private Long id;
    private String name;
    private String role;
    private int compatibility;
    private Double matchScore; // Add this field
    private String img;
    private String skills;
    private String interests;
    private String status;
    private String email; // Add this field
    private String personality;

public SentRequestDTO(RequestEntity req, UserEntity receiver) {
        this(req, receiver, req.getMatchScore());
    }

public SentRequestDTO(RequestEntity req, UserEntity receiver, Double matchScore) {
    this.id = req.getId();
    this.name = receiver.getName();

    // Safely get the preferred role (first in list if available)
    if (receiver.getProfile() != null && receiver.getProfile().getSurvey() != null
            && receiver.getProfile().getSurvey().getPreferredRoles() != null
            && !receiver.getProfile().getSurvey().getPreferredRoles().isEmpty()) {
        this.role = receiver.getProfile().getSurvey().getPreferredRoles().get(0);
    } else {
        this.role = "";
    }

    this.compatibility = matchScore != null ? matchScore.intValue() : 0;
    this.matchScore = matchScore;
    this.img = "https://placehold.co/144x142";

    // Safely join technical skills
    if (receiver.getProfile() != null && receiver.getProfile().getSurvey() != null
            && receiver.getProfile().getSurvey().getTechnicalSkills() != null) {
        this.skills = String.join(", ", receiver.getProfile().getSurvey().getTechnicalSkills());
    } else {
        this.skills = "";
    }

    // Safely join project interests
    if (receiver.getProfile() != null && receiver.getProfile().getSurvey() != null
            && receiver.getProfile().getSurvey().getProjectInterests() != null) {
        this.interests = String.join(", ", receiver.getProfile().getSurvey().getProjectInterests());
    } else {
        this.interests = "";
    }

    // Add personality
    if (receiver.getProfile() != null && receiver.getProfile().getSurvey() != null
            && receiver.getProfile().getSurvey().getPersonality() != null) {
        this.personality = receiver.getProfile().getSurvey().getPersonality();
    } else {
        this.personality = "";
    }

    this.status = req.getStatus();
    this.email = receiver.getEmail(); // Add this line to set the email
}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public int getCompatibility() { return compatibility; }
    public void setCompatibility(int compatibility) { this.compatibility = compatibility; }
    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
    public String getImg() { return img; }
    public void setImg(String img) { this.img = img; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPersonality() { return personality; }
    public void setPersonality(String personality) { this.personality = personality; }
}
