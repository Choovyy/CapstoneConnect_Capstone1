package CapstoneConnect.Capstone_1.entity;

import CapstoneConnect.Capstone_1.dto.SurveyDTO;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "surveys")
public class SurveyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "survey_technical_skills", joinColumns = @JoinColumn(name = "survey_id"))
    @Column(name = "technical_skill")
    private List<String> technicalSkills;

    @ElementCollection
    @CollectionTable(name = "survey_project_interests", joinColumns = @JoinColumn(name = "survey_id"))
    @Column(name = "project_interest")
    private List<String> projectInterests;

    @ElementCollection
    @CollectionTable(name = "survey_preferred_roles", joinColumns = @JoinColumn(name = "survey_id"))
    @Column(name = "preferred_role")
    private List<String> preferredRoles;

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
    }

    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = preferredRoles;
    }

    // SurveyDTO conversion
    public SurveyDTO toDTO() {
        SurveyDTO surveyDTO = new SurveyDTO();
        surveyDTO.setId(this.id);
        surveyDTO.setTechnicalSkills(this.technicalSkills);
        surveyDTO.setProjectInterests(this.projectInterests);
        surveyDTO.setPreferredRoles(this.preferredRoles);
        return surveyDTO;
    }


}
