package CapstoneConnect.Capstone_1.service;

import CapstoneConnect.Capstone_1.entity.ProfileEntity;
import CapstoneConnect.Capstone_1.dto.ProfileDTO;
import CapstoneConnect.Capstone_1.entity.SurveyEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.ProfileRepository;
import CapstoneConnect.Capstone_1.repository.SurveyRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
//import CapstoneConnect.Capstone_1.dto.ProfileDTO;
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

        // Try to find existing profile for this user
        ProfileEntity profileEntity = profileRepository.findByUserId(userId).orElseGet(() -> {
            ProfileEntity newProfile = new ProfileEntity();
            newProfile.setUser(user);
            return newProfile;
        });

        profileEntity.setProfilePicture(profileDTO.getProfilePicture());
        profileEntity.setGithub(profileDTO.getGithub());

        // Update survey or create if missing
        SurveyEntity surveyEntity = profileEntity.getSurvey();
        if (surveyEntity == null) {
            surveyEntity = new SurveyEntity();
        }
        surveyEntity.setTechnicalSkills(profileDTO.getTechnicalSkills());
        surveyEntity.setProjectInterests(profileDTO.getProjectInterests());
        surveyEntity.setPreferredRoles(profileDTO.getPreferredRoles());

        SurveyEntity savedSurvey = surveyRepository.save(surveyEntity);
        profileEntity.setSurvey(savedSurvey);

        return profileRepository.save(profileEntity);
    }

    public ProfileDTO updateProfilePicture(Long profileId, String profilePictureUrl) {
    ProfileEntity profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Profile not found with id: " + profileId));
    
    profile.setProfilePicture(profilePictureUrl);
    ProfileEntity savedProfile = profileRepository.save(profile);
    
    return savedProfile.toDTO();
}

}
