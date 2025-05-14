package CapstoneConnect.Capstone_1.service;

import CapstoneConnect.Capstone_1.dto.SurveyDTO;
import CapstoneConnect.Capstone_1.entity.ProfileEntity;
import CapstoneConnect.Capstone_1.entity.SurveyEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.ProfileRepository;
import CapstoneConnect.Capstone_1.repository.SurveyRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    public SurveyDTO getSurveyByProfileId(Long profileId) {
        ProfileEntity profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        SurveyEntity survey = profile.getSurvey();
        if (survey == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Survey not found for this profile");
        }

        return survey.toDTO();
    }

    @Transactional
    public SurveyDTO saveSurvey(Long userId, SurveyDTO surveyDTO) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        ProfileEntity profile = profileRepository.findByUserId(userId).orElseGet(() -> {
            ProfileEntity newProfile = new ProfileEntity();
            newProfile.setUser(user);
            return newProfile;
        });

        if (profile.getSurvey() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Survey already exists for this profile.");
        }

        SurveyEntity survey = new SurveyEntity();
        applySurveyDTOToEntity(surveyDTO, survey);

        SurveyEntity savedSurvey = surveyRepository.save(survey);
        profile.setSurvey(savedSurvey);
        profileRepository.save(profile);

        updateUserFirstTimeFlag(user);
        return savedSurvey.toDTO();
    }

    @Transactional
    public SurveyDTO updateSurvey(Long profileId, SurveyDTO surveyDTO) {
        ProfileEntity profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        SurveyEntity survey = profile.getSurvey();
        if (survey == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Survey does not exist. Use save instead.");
        }

        applySurveyDTOToEntity(surveyDTO, survey);
        SurveyEntity savedSurvey = surveyRepository.save(survey);

        profile.setSurvey(savedSurvey);
        profileRepository.save(profile);

        updateUserFirstTimeFlag(profile.getUser());
        return savedSurvey.toDTO();
    }

    private void applySurveyDTOToEntity(SurveyDTO dto, SurveyEntity entity) {
        entity.setTechnicalSkills(dto.getTechnicalSkills());
        entity.setProjectInterests(dto.getProjectInterests());
        entity.setPreferredRoles(dto.getPreferredRoles());
    }

    private void updateUserFirstTimeFlag(UserEntity user) {
        if (user != null && user.isFirstTimeUser()) {
            user.setFirstTimeUser(false);
            userRepository.save(user);
        }
    }
}
