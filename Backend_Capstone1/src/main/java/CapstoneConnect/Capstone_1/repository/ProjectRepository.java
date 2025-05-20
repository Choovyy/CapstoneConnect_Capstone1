package CapstoneConnect.Capstone_1.repository;


import CapstoneConnect.Capstone_1.entity.ProjectEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    List<ProjectEntity> findByUser(UserEntity user);

    @Query("SELECT DISTINCT p FROM ProjectEntity p LEFT JOIN p.teamMembers tm WHERE p.user.id = :userId OR tm.id = :userId")
    List<ProjectEntity> findProjectsByUserOrTeamMember(@Param("userId") Long userId);
}

