package CapstoneConnect.Capstone_1.service;

import CapstoneConnect.Capstone_1.entity.ProfileEntity;
import CapstoneConnect.Capstone_1.dto.ProfileDTO;
import CapstoneConnect.Capstone_1.entity.SurveyEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.ProfileRepository;
import CapstoneConnect.Capstone_1.repository.SurveyRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SurveyRepository surveyRepository;


    public ProfileEntity getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public ProfileEntity saveOrUpdateProfile(Long userId, ProfileDTO profileDTO) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        ProfileEntity profileEntity = new ProfileEntity();
        profileEntity.setUser(user);
        profileEntity.setProfilePicture(profileDTO.getProfilePicture());

        SurveyEntity surveyEntity = new SurveyEntity();
        surveyEntity.setTechnicalSkills(profileDTO.getTechnicalSkills());
        surveyEntity.setProjectInterests(profileDTO.getProjectInterests());
        surveyEntity.setPreferredRoles(profileDTO.getPreferredRoles());

// 🔽 Save the SurveyEntity first to generate the ID
        SurveyEntity savedSurvey = surveyRepository.save(surveyEntity);

        profileEntity.setSurvey(savedSurvey);

// ✅ Then save the ProfileEntity
        return profileRepository.save(profileEntity);

    }

}
