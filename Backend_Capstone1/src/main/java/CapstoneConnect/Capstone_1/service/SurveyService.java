package CapstoneConnect.Capstone_1.service;

import CapstoneConnect.Capstone_1.dto.SurveyDTO;
import CapstoneConnect.Capstone_1.entity.ProfileEntity;
import CapstoneConnect.Capstone_1.entity.SurveyEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.ProfileRepository;
import CapstoneConnect.Capstone_1.repository.SurveyRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
//import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;


@Service
public class SurveyService {    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Value("${matching.service.url}")
    private String matchingServiceUrl;

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

        SurveyEntity savedSurvey = surveyRepository.save(survey);        profile.setSurvey(savedSurvey);
        profileRepository.save(profile);

        updateUserFirstTimeFlag(user);
        
        // Send survey data to matching service
        sendSurveyToMatchingService(user, savedSurvey.toDTO());
        
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

        profile.setSurvey(savedSurvey);        profileRepository.save(profile);

        updateUserFirstTimeFlag(profile.getUser());
        
        // Send updated survey data to matching service
        sendSurveyToMatchingService(profile.getUser(), savedSurvey.toDTO());
        
        return savedSurvey.toDTO();
    }

    private void applySurveyDTOToEntity(SurveyDTO dto, SurveyEntity entity) {
        entity.setTechnicalSkills(dto.getTechnicalSkills());
        entity.setProjectInterests(dto.getProjectInterests());
        entity.setPreferredRoles(dto.getPreferredRoles());
    }    private void updateUserFirstTimeFlag(UserEntity user) {
        if (user != null && user.isFirstTimeUser()) {
            user.setFirstTimeUser(false);
            userRepository.save(user);
        }
    }    private void sendSurveyToMatchingService(UserEntity user, SurveyDTO survey) {
    if (user == null || survey == null) {
        System.err.println("❌ Cannot send null user or survey data to matching service");
        return;
    }
    
    RestTemplate restTemplate = new RestTemplate();
    String fastApiUrl = matchingServiceUrl + "/add_profile";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> payload = new HashMap<>();
    payload.put("email", user.getEmail());
    payload.put("name", user.getName());
    payload.put("technicalSkills", survey.getTechnicalSkills());
    payload.put("preferredRoles", survey.getPreferredRoles());
    payload.put("projectInterests", survey.getProjectInterests());

    try {
        // Log what we're about to send
        System.out.println("✅ Sending data to matching service for user: " + user.getEmail());
        
        ObjectMapper mapper = new ObjectMapper();
        String jsonPayload = mapper.writeValueAsString(payload);
        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(fastApiUrl, request, String.class);
        
        // Check response status
        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("✅ Successfully sent to matching service: " + response.getBody());
        } else {
            System.err.println("❌ Matching service returned error status: " + response.getStatusCode());
        }
    } catch (Exception e) {
        System.err.println("❌ Error calling matching service: " + e.getMessage());
        e.printStackTrace(); // Added for more detailed debugging
    }
  }  public List<Map<String, Object>> getMatchesFromAISystem(SurveyDTO surveyDTO) {
    if (surveyDTO == null) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Survey data cannot be null");
    }
  
    RestTemplate restTemplate = new RestTemplate();
    String url = matchingServiceUrl + "/match";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("technicalSkills", surveyDTO.getTechnicalSkills());
    requestBody.put("preferredRoles", surveyDTO.getPreferredRoles());
    requestBody.put("projectInterests", surveyDTO.getProjectInterests());
    // Optional: requestBody.put("email", yourUserEmail); ← to exclude self

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

    try {
        // Log what we're about to send
        System.out.println("✅ Requesting matches from AI system");
        
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        
        // Check response status
        if (!response.getStatusCode().is2xxSuccessful()) {
            System.err.println("❌ Matching service returned error status: " + response.getStatusCode());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                                             "Matching service returned status " + response.getStatusCode());
        }
        
        ObjectMapper mapper = new ObjectMapper();
        Map<String, List<Map<String, Object>>> responseMap = mapper.readValue(
            response.getBody(), 
            new TypeReference<Map<String, List<Map<String, Object>>>>() {}
        );
        
        List<Map<String, Object>> matches = responseMap.get("matches");
        System.out.println("✅ Received " + (matches != null ? matches.size() : 0) + " matches from AI system");
        
        if (matches == null) {
            return new ArrayList<>(); // Return empty list instead of null
        }
        
        return matches;
    } catch (Exception e) {
        System.err.println("❌ Error calling /match: " + e.getMessage());
        e.printStackTrace(); // Added for more detailed debugging
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Matching service unavailable: " + e.getMessage());
    }
}


}

