package CapstoneConnect.Capstone_1.dto;

//import java.util.List;
import java.util.Map;

public class QuizAnswersDTO {
    private Long userId;
    private Map<Long, Integer> answers; // QuestionId -> Score (1-5)
    
    public QuizAnswersDTO() {
    }
    
    public QuizAnswersDTO(Long userId, Map<Long, Integer> answers) {
        this.userId = userId;
        this.answers = answers;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Map<Long, Integer> getAnswers() {
        return answers;
    }
    
    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }
}
