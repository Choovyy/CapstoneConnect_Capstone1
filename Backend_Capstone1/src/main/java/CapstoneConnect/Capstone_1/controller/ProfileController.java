package CapstoneConnect.Capstone_1.controller;

import CapstoneConnect.Capstone_1.dto.ProfileDTO;
import CapstoneConnect.Capstone_1.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
