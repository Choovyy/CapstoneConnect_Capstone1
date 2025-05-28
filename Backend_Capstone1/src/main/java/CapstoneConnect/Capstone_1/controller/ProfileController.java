package CapstoneConnect.Capstone_1.controller;

import CapstoneConnect.Capstone_1.dto.ProfileDTO;
import CapstoneConnect.Capstone_1.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/{userId}")
    public ProfileDTO getProfile(@PathVariable Long userId) {
        return profileService.getProfileByUserId(userId).toDTO();
    }

    @PostMapping("/update/{userId}")
    public ProfileDTO updateProfile(@PathVariable Long userId, @RequestBody ProfileDTO profileDTO) {
        return profileService.saveOrUpdateProfile(userId, profileDTO).toDTO();
    }

    @PutMapping("/{profileId}/profile-picture")
    public ResponseEntity<?> updateProfilePicture(@PathVariable Long profileId, @RequestBody Map<String, String> request) {
    try {
        String profilePictureUrl = request.get("profilePictureUrl");
        ProfileDTO updatedProfile = profileService.updateProfilePicture(profileId, profilePictureUrl);
        return ResponseEntity.ok(updatedProfile);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating profile picture: " + e.getMessage());
    }
}
}
