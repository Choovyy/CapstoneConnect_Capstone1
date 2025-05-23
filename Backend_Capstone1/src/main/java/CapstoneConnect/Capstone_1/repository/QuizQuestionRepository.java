package CapstoneConnect.Capstone_1.repository;

import CapstoneConnect.Capstone_1.entity.QuizQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestionEntity, Long> {
    // Custom queries if needed
}
