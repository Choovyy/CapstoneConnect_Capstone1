package CapstoneConnect.Capstone_1.repository;



import CapstoneConnect.Capstone_1.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByOauthId(String oauthId);
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findById(Long id); // Added method to find user by ID
    Optional<UserEntity> findByName(String name); // Added method to find user by name
}
