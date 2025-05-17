package CapstoneConnect.Capstone_1.repository;




import CapstoneConnect.Capstone_1.entity.ProjectEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    List<ProjectEntity> findByUser(UserEntity user);
}

