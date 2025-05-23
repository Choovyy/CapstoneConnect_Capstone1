package CapstoneConnect.Capstone_1.controller;

import CapstoneConnect.Capstone_1.dto.QuizAnswersDTO;
import CapstoneConnect.Capstone_1.dto.QuizQuestionDTO;
import CapstoneConnect.Capstone_1.service.PersonalityQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personality-quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class PersonalityQuizController {

    @Autowired
    private PersonalityQuizService personalityQuizService;

    @GetMapping("/questions")
    public ResponseEntity<List<QuizQuestionDTO>> getQuizQuestions() {
        return ResponseEntity.ok(personalityQuizService.getAllQuestions());
    }    @PostMapping("/submit")
    public ResponseEntity<String> submitQuizAnswers(@RequestBody QuizAnswersDTO answersDTO) {
        System.out.println("📝 Received quiz answers submission for userId: " + answersDTO.getUserId());
        
        if (answersDTO.getAnswers() == null || answersDTO.getAnswers().isEmpty()) {
            System.err.println("❌ Received empty answers for quiz submission");
            return ResponseEntity.badRequest().body("No answers provided");
        }
        
        String personalityType = personalityQuizService.processQuizAnswers(answersDTO);
        
        if (personalityType == null || personalityType.trim().isEmpty()) {
            System.err.println("❌ Generated empty personality type, using default");
            personalityType = "Balanced Team Player";
        }
        
        System.out.println("✅ Returning personality type: " + personalityType);
        return ResponseEntity.ok(personalityType);
    }

    @GetMapping("/initialize")
    public ResponseEntity<String> initializeQuiz() {
        personalityQuizService.initializeQuizQuestions();
        return ResponseEntity.ok("Quiz questions initialized successfully");
    }
}
