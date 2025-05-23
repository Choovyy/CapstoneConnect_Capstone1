package CapstoneConnect.Capstone_1.entity;

import CapstoneConnect.Capstone_1.dto.ProfileDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class ProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "github")
    private String github;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference(value = "profile-user")
    private UserEntity user;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "survey_id", referencedColumnName = "id")
    @JsonBackReference
    private SurveyEntity survey;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public SurveyEntity getSurvey() {
        return survey;
    }

    public void setSurvey(SurveyEntity survey) {
        this.survey = survey;
    }

    // ProfileDTO conversion
    public ProfileDTO toDTO() {
        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setId(this.id);
        profileDTO.setProfilePicture(this.profilePicture);
        profileDTO.setGithub(this.github);

        // ✅ Set the user's ID, name, and email if available
        if (this.user != null) {
            profileDTO.setUserId(this.user.getId());
            profileDTO.setName(this.user.getName());
            profileDTO.setEmail(this.user.getEmail());
        }        if (this.survey != null) {
            profileDTO.setTechnicalSkills(this.survey.getTechnicalSkills());
            profileDTO.setProjectInterests(this.survey.getProjectInterests());
            profileDTO.setPreferredRoles(this.survey.getPreferredRoles());
            profileDTO.setPersonality(this.survey.getPersonality());
        }

        return profileDTO;
    }
}
