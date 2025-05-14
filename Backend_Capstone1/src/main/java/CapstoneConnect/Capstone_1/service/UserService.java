package CapstoneConnect.Capstone_1.service;


import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserEntity saveUserIfNotExists(String oauthId, String email, String name) {
        Optional<UserEntity> existingUser = userRepository.findByOauthId(oauthId);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        if (email != null && !email.isEmpty()) {
            existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                UserEntity user = existingUser.get();
                if (user.getOauthId() == null) {
                    user.setOauthId(oauthId);
                    user.setFirstTimeUser(false); // Mark as no longer a first-time user
                    userRepository.saveAndFlush(user);
                }
                return user;
            }
        }

        // If user doesn't exist, create a new one
        UserEntity newUser = new UserEntity(oauthId, email, name, true); // Mark as first-time user
        return userRepository.saveAndFlush(newUser);
    }

    public boolean isFirstTimeUser(String email) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(email);
        return existingUser.isEmpty() || existingUser.get().isFirstTimeUser(); // Check if the user is still marked as first-time
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    //Helper method
    public Optional<UserEntity> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<Long> getUserIdByOauthId(String oauthId) {
        return userRepository.findByOauthId(oauthId).map(UserEntity::getId);
    }


}

